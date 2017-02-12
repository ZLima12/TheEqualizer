import * as DiscordJS from "discord.js";

const biasAdmin: boolean = false;

export class Vote
{
	member: DiscordJS.GuildMember;
	modifier: number;

	constructor(member: DiscordJS.GuildMember, upvote: boolean)
	{
		this.member = member;
		this.modifier = (upvote) ? 1 : -1;
	}
}

export class Poll
{
	message: DiscordJS.Message;
	uid: string;
	desc: string;
	action: () => void;
	stillValid: () => boolean;
	votesNeeded: () => number;
	votes: Array<Vote>;
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
		this.votes = new Array<Vote>();
		this.concluded = false;
	}

	voteCount(): number
	{
		let count = 0;
		
		for (let vote of this.votes)
			count += vote.modifier;
		
		return count;
	}

	underway(): boolean
	{
		return (this.votes.length > 0);
	}

	sendMessage(message: string): void
	{
		this.message.channel.sendMessage(message);
	}

	reply(message: string): void
	{
		this.message.reply(message);
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
			this.votes.push(new Vote(this.message.member, true));
			
			this.sendMessage("A poll has been started to " + this.desc + '.');
			this.sendMessage(this.voteCount() + '/' + this.votesNeeded() + " votes.");
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
		}
		
		else if (this.voteCount() >= this.votesNeeded())
		{
			this.action();
			this.end("The poll to " + this.desc + " has concluded successfully!");
		}
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
			message.reply("Invalid usage. `=" + desc + " @SomeUser`.");
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
			if ("<@" + member.user.id + '>' == command[1])
				target = member;

			else if ("<@!" + member.user.id + '>' == command[1])
			{
				switch (biasAdmin)
				{
					case true:
						message.reply("No can do, all praise " + command[1] + '.');
						return;
					
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
			() => (target.voiceChannelID == message.member.voiceChannelID),
			() => Math.floor(voiceChannel.members.array().length * fraction)
		);
	}
}
