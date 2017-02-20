import * as DiscordJS from "discord.js";
import Command from "./commands/command";

const biasAdmin: boolean = false;

enum VoteType
{
	Upvote = 1,
	Downvote = -1,
	Abstain = 0
}

export class Vote
{
	member: DiscordJS.GuildMember;
	voteType: VoteType;

	constructor(member: DiscordJS.GuildMember, voteType: VoteType)
	{
		this.member = member;
		this.voteType = voteType;
	}

	static voteTypeFromString(typeString: string): VoteType
	{
		let voteType: VoteType = null;

		typeString = typeString.toLowerCase();

		if (typeString === "yes" || typeString === "up")
			return VoteType.Upvote;
		
		if (typeString === "no" || typeString === "down")
			return VoteType.Downvote;
		
		if (typeString === "abstain" || typeString === "neutral")
			return VoteType.Abstain;
		
		return undefined;
	}

	static Type = VoteType;
}

export class Poll
{
	message: DiscordJS.Message;
	uid: string;
	desc: string;
	action: () => void;
	stillValid: () => boolean;
	votesNeeded: () => number;
	votes: Map<string ,Vote>;
	concluded: boolean;

	constructor
	(
		message: DiscordJS.Message,
		desc: string,
		action: () => void,
		valid: () => boolean,
		votesNeeded: () => number
	)
	{
		this.message = message;
		this.uid = message.author.id;
		this.desc = desc;
		this.action = action;
		this.stillValid = valid;
		this.votesNeeded = votesNeeded;
		this.votes = new Map<string, Vote>();
		this.concluded = false;
	}

	voteSum(): number
	{
		let count = 0;
		
		for (let [id, vote] of this.votes)
			count += vote.voteType;
		
		return count;
	}

	votesOfType(voteType: VoteType): Array<Vote>
	{
		let votes = new Array<Vote>();
		for (let [id, vote] of this.votes)
		{
			if (vote.voteType === voteType)
				votes.push(vote);
		}

		return votes;
	}

	underway(): boolean
	{
		return (this.votes.size > 0);
	}

	sendMessage(message: string): void
	{
		this.message.channel.sendMessage(message);
	}

	reply(message: string): void
	{
		this.message.reply(message);
	}

	sendStatus(): void
	{
		this.message.channel.sendMessage
		(
			"Sum of votes: " + this.voteSum() + " of " + this.votesNeeded() + " necessary.\n(" +
			this.votesOfType(VoteType.Upvote).length + " upvotes, " +
			this.votesOfType(VoteType.Downvote).length + " downvotes, and " +
			this.votesOfType(VoteType.Abstain).length + " abstains)"
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
			this.votes.set(this.message.author.id, new Vote(this.message.member, VoteType.Upvote));
			
			this.sendMessage("A poll has been started to " + this.desc + '.');
			this.sendStatus();
			this.check();
		}
	}

	end(message: string = "The poll has ended."): void
	{
		this.concluded = true;

		this.sendMessage(message);
	}

	check(): void
	{
		if (this.concluded)
		{

		}

		else if (!this.stillValid())
		{
			this.sendMessage("The poll has been invalidated.");
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
		command[0] = command[0].substring(0);

		let voteType = Vote.voteTypeFromString(command[1]);

		if (command.length !== 2 || voteType === undefined)
		{
			return Command.ExitStatus.BadInvocation;
		}

		if (this.votes.get(message.author.id) !== undefined)
		{
			let vote = this.votes.get(message.author.id);
			
			if (vote.voteType === voteType)
			{
				message.reply("You have already voted, and your previous vote is the same as the new one.");
				return Command.ExitStatus.BadInvokeNoReply;
			}

			vote.voteType = voteType;
			message.reply("You have changed your vote.");
		}

		this.votes.set(message.author.id, new Vote(message.member, voteType));
		
		this.sendStatus();
		
		this.check();

		return Command.ExitStatus.Success;
	}

	static standardPoll
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
			if ("<@" + member.user.id + '>' === command[1])
				target = member;

			else if ("<@!" + member.user.id + '>' === command[1])
			{
				switch (biasAdmin)
				{
					case true:
						message.reply("No can do, all praise " + command[1] + '.');
						return null;
					
					case false:
						target = member;
						break;
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
			() => Math.floor(voiceChannel.members.array().length * fraction)
		);
	}

	static currentPoll = null;
}
