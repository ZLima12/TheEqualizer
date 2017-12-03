import { Handler } from "../event";
import * as DiscordJS from "discord.js";
import EqualizerClient from "../client";
import Moderation from "../moderation";

export = new Handler
(
	"voiceStateUpdate",

	(client: EqualizerClient, oldMember: DiscordJS.GuildMember, newMember: DiscordJS.GuildMember) =>
	{
		if (Moderation.DoNotDisturb.moveUserIfAfk(newMember)) return;

		Moderation.DoNotDisturb.restoreChannelIfReturned(newMember);
		Moderation.DoNotDisturb.verifyPreviousChannelEntry(newMember);
	}
);
