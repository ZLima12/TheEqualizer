import EventHandler from "../event-handler";
import * as DiscordJS from "discord.js";
import * as VoteSystem from "../vote-system";
import Moderation from "../moderation";

export = new EventHandler
(
	"voiceStateUpdate",

	(oldMember: DiscordJS.GuildMember, newMember: DiscordJS.GuildMember) =>
	{
		if (VoteSystem.Poll.currentPoll !== null)
		{
			VoteSystem.Poll.currentPoll.check();
			if (VoteSystem.Poll.currentPoll.Concluded)
				VoteSystem.Poll.currentPoll = null;
		}

		if (Moderation.DoNotDisturb.moveUserIfAfk(newMember)) return;

		Moderation.DoNotDisturb.restoreChannelIfReturned(newMember);
		Moderation.DoNotDisturb.verifyPreviousChannelEntry(newMember);
	}
);
