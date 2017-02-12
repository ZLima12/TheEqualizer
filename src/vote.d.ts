import * as DiscordJS from "discord.js";

declare module "VoteSystem"
{
	export class Vote
	{
		member: DiscordJS.GuildMember;
		modifier: number;

		constructor(member: DiscordJS.GuildMember, upvote: boolean);
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
		);

		voteCount(): number;
		underway(): boolean;
		sendMessage(message: string): void;
		reply(message: string): void;
		start(): void;
		end(message: string): void;
		check(): void;

		static standardPoll
		(
			message: DiscordJS.Message,
			desc: string,
			action: (member: DiscordJS.GuildMember) => void,
			fraction: number
		): Poll;
	}
}