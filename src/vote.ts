import * as DiscordJS from "discord.js";
import Command from "./command";

class Vote
{
	protected member: DiscordJS.GuildMember;
	get Member(): DiscordJS.GuildMember
	{ return this.member }

	protected voteType: Vote.Type;
	get Type(): Vote.Type
	{ return this.voteType }
	set Type(type: Vote.Type)
	{ this.voteType = type }

	constructor(member: DiscordJS.GuildMember, voteType: Vote.Type)
	{
		this.member = member;
		this.voteType = voteType;
	}
}

namespace Vote
{
	export enum Type
	{
		Upvote = 1,
		Downvote = -1,
		Abstain = 0
	}

	export function voteTypeFromString(typeString: string): Vote.Type
	{
		let voteType: Vote.Type = null;

		typeString = typeString.toLowerCase();

		if (typeString === "yes" || typeString === "up")
			return Vote.Type.Upvote;
		
		if (typeString === "no" || typeString === "down")
			return Vote.Type.Downvote;
		
		if (typeString === "abstain" || typeString === "neutral")
			return Vote.Type.Abstain;
		
		return undefined;
	}
}

export default Vote;