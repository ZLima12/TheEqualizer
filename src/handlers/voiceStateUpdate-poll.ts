import { Handler } from "../event";
import * as DiscordJS from "discord.js";
import EqualizerClient from "../client";
import Poll from "../poll";

export = new Handler
(
	"voiceStateUpdate",

	(client: EqualizerClient, oldMember: DiscordJS.GuildMember, newMember: DiscordJS.GuildMember) =>
	{
		if (Poll.currentPoll.get(newMember.guild.id))
		{
			Poll.currentPoll.get(newMember.guild.id).check();
			if (Poll.currentPoll.get(newMember.guild.id).Concluded)
				Poll.currentPoll.delete(newMember.guild.id);
		}
	}
);
