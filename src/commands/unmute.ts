import Command from "../command";
import * as DiscordJS from "discord.js";
import * as VoteSystem from "../vote";

export = new Command
(
	"unmute",

	async (message: DiscordJS.Message) =>
	{
		if (VoteSystem.Poll.currentPoll === null)
		{
			VoteSystem.Poll.currentPoll = VoteSystem.Poll.standardPoll(message, "unmute", (member: DiscordJS.GuildMember) => member.setMute(false), (2 / 3));

			if (VoteSystem.Poll.currentPoll !== null)
			{
				VoteSystem.Poll.currentPoll.start();
				return Command.ExitStatus.Success;
			}

			else
				return Command.ExitStatus.BadInvocation;
		}

		else
		{
			message.reply("There is already a poll underway.");
			return Command.ExitStatus.BadInvocation;
		}
	}
);