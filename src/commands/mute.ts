import Command from "../command";
import * as DiscordJS from "discord.js";
import * as VoteSystem from "../vote";

let mute: Command = new Command
(
	"mute",

	(message: DiscordJS.Message) =>
	{
		if (VoteSystem.Poll.currentPoll === null)
		{
			VoteSystem.Poll.currentPoll = VoteSystem.Poll.standardPoll(message, "mute", (member: DiscordJS.GuildMember) => member.setMute(true), (2 / 3));
			
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

export = mute;