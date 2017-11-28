import { Handler } from "../event";
import * as DiscordJS from "discord.js";
import EqualizerClient from "../client";
import Poll from "../poll";
import Moderation from "../moderation";

export = new Handler
(
	"voiceStateUpdate",

	(client: EqualizerClient, oldMember: DiscordJS.GuildMember, newMember: DiscordJS.GuildMember) =>
	{
		if (Poll.currentPoll !== null)
		{
			Poll.currentPoll.check();
			if (Poll.currentPoll.Concluded)
				Poll.currentPoll = null;
		}

		if (Moderation.DoNotDisturb.moveUserIfAfk(newMember)) return;

		Moderation.DoNotDisturb.restoreChannelIfReturned(newMember);
		Moderation.DoNotDisturb.verifyPreviousChannelEntry(newMember);
	}
);
