import * as DiscordJS from "discord.js";
import Command from "./command";
import Vote from "./vote";
let options = require("../options");

class Poll
{
	protected message: DiscordJS.Message;
	get Message(): DiscordJS.Message
	{ return this.message }

	protected author: DiscordJS.GuildMember;
	get Author(): DiscordJS.GuildMember
	{ return this.author }

	protected desc: string;
	get Description(): string
	{ return this.desc }

	protected action: () => void;
	get Action(): () => void
	{ return this.action }

	protected stillValid: () => boolean;
	get IsStillValid(): () => boolean
	{ return this.stillValid }

	protected votesNeeded: () => number;
	get VotesNeeded(): () => number
	{ return this.votesNeeded }

	protected votes: Map<string, Vote>;
	get Votes(): Map<string, Vote>
	{ return this.votes }

	protected concluded: boolean;
	get Concluded(): boolean
	{ return this.concluded }
	
	protected voiceChannel: () => DiscordJS.VoiceChannel;
	get VoiceChannel(): () => DiscordJS.VoiceChannel
	{ return this.voiceChannel }

	constructor
	(
		message: DiscordJS.Message,
		desc: string,
		action: () => void,
		valid: () => boolean,
		votesNeeded: () => number,
		voiceChannel: () => DiscordJS.VoiceChannel /** null if not needed */
	)
	{
		this.message = message;
		this.author = message.member;
		this.desc = desc;
		this.action = action;
		this.stillValid = valid;
		this.votesNeeded = votesNeeded;
		this.votes = new Map<string, Vote>();
		this.concluded = false;
		this.voiceChannel = voiceChannel;
	}

	voteSum(): number
	{
		let count = 0;

		for (let [id, vote] of this.votes)
			count += vote.Type;

		return count;
	}

	votesOfType(voteType: Vote.Type): Array<Vote>
	{
		let votes = new Array<Vote>();
		for (let [id, vote] of this.votes)
		{
			if (vote.Type === voteType)
				votes.push(vote);
		}

		return votes;
	}

	underway(): boolean
	{
		return (this.votes.size > 0);
	}

	send(message: string): void
	{
		this.message.channel.send(message);
	}

	reply(message: string): void
	{
		this.message.reply(message);
	}

	sendStatus(): void
	{
		this.message.channel.send
		(
			"Sum of votes: " + this.voteSum() + " of " + this.votesNeeded() + " necessary.\n(" +
			this.votesOfType(Vote.Type.Upvote).length + " upvotes, " +
			this.votesOfType(Vote.Type.Downvote).length + " downvotes, and " +
			this.votesOfType(Vote.Type.Abstain).length + " abstains)"
		);
	}

	start() : void
	{
		if (this.message.channel.type != "text")
		{
			this.message.reply("I'm not quite sure what to do in this context...");
			return;
		}

		else
		{
			this.votes.set(this.message.author.id, new Vote(this.message.member, Vote.Type.Upvote));

			this.send("A poll has been started to " + this.desc + '.');
			this.sendStatus();
			this.check();
		}
	}

	end(message: string = "The poll has ended."): void
	{
		this.concluded = true;

		this.send(message);
	}

	check(): void
	{
		if (this.concluded)
		{

		}

		else if (!this.stillValid())
		{
			this.send("The poll has been invalidated.");
			this.concluded = true;
		}

		else if (this.voteSum() >= this.votesNeeded())
		{
			this.action();
			this.end("The poll to " + this.desc + " has concluded successfully!");
			this.concluded = true;
		}
	}

	vote(message: DiscordJS.Message): Command.ExitStatus
	{
		let command: Array<string> = message.content.split(' ');
		command[0] = command[0].substring(1);

		let voteType = Vote.voteTypeFromString(command[1]);

		if (command.length !== 2 || voteType === undefined)
		{
			return Command.ExitStatus.BadInvocation;
		}
		
		if (this.voiceChannel() !== null && message.member.voiceChannel !== this.voiceChannel())
		{
			return Command.ExitStatus.NotInVoiceChannel;
		}

		if (this.votes.get(message.author.id) !== undefined)
		{
			let vote = this.votes.get(message.author.id);

			if (vote.Type === voteType)
			{
				message.reply("You have already voted, and your previous vote is the same as the new one.");
				return Command.ExitStatus.BadInvokeNoReply;
			}

			vote.Type = voteType;
			message.reply("You have changed your vote.");
		}

		this.votes.set(message.author.id, new Vote(message.member, voteType));

		this.sendStatus();

		this.check();

		return Command.ExitStatus.Success;
	}
}

namespace Poll
{
	export var currentPoll: Poll = null;

	export function standardPoll
	(
		message: DiscordJS.Message,
		desc: string,
		action: (member: DiscordJS.GuildMember) => void,
		fraction: number
	): Poll
	{
		let command: Array<string> = message.content.split(' ');
		command[0] = command[0].substring(1);

		if (command.length != 2)
		{
			return null;
		}

		let server: DiscordJS.Guild = message.guild;

		let target: DiscordJS.GuildMember = null;

		for (let member of server.members.array())
		{
			if ("<@" + member.user.id + '>' === command[1] || "<@!" + member.user.id + '>' === command[1])
			{
				target = member;

				if (member.hasPermission("ADMINISTRATOR") && options.biasAdmin)
				{
					message.reply("No can do, all praise " + command[1] + '!');
					return null;
				}
			}
		}

		if (target === null)
		{
			message.reply("No user found by " + command[1] + '.');

			return null;
		}
		
		let onlineUserCount: number = 0;
		for (let member of server.members.array())
		{
			if (member.user.presence.status === "online")
			{
				onlineUserCount ++;
			}
		}

		return new Poll
		(
			message,
			desc + ' ' + command[1],

			() => action(target),
			() => (true),
			() => Math.floor(onlineUserCount * fraction),
			() => null
		);
	}
	
	export function voicePoll
	(
		message: DiscordJS.Message,
		desc: string,
		action: (member: DiscordJS.GuildMember) => void,
		fraction: number
	): Poll
	{
		let command: Array<string> = message.content.split(' ');
		command[0] = command[0].substring(1);

		if (command.length != 2)
		{
			return null;
		}


		if (message.member.voiceChannel === undefined)
		{
			message.reply("You must be in a voice channel to start this vote.");
			return null;
		}

		let voiceChannel: DiscordJS.VoiceChannel = message.member.voiceChannel;

		let target: DiscordJS.GuildMember = null;

		for (let member of voiceChannel.members.array())
		{
			if ("<@" + member.user.id + '>' === command[1] || "<@!" + member.user.id + '>' === command[1])
			{
				target = member;

				if (member.hasPermission("ADMINISTRATOR") && options.biasAdmin)
				{
					message.reply("No can do, all praise " + command[1] + '!');
					return null;
				}
			}
		}

		if (target === null)
		{
			message.reply("No user found by " + command[1] + '.');

			return null;
		}

		return new Poll
		(
			message,
			desc + ' ' + command[1],

			() => action(target),
			() => (target.voiceChannelID === message.member.voiceChannelID),
			() => Math.floor(voiceChannel.members.array().length * fraction),
			() => voiceChannel
		);
	}
}

export default Poll;
