import EventHandler from "../event-handler";
import * as DiscordJS from "discord.js";
import Poll from "../poll";
import Moderation from "../moderation";

export = new EventHandler
(
	"voiceStateUpdate",

	(oldMember: DiscordJS.GuildMember, newMember: DiscordJS.GuildMember) =>
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
