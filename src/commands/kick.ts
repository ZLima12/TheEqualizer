import Command from "../command";
import * as DiscordJS from "discord.js";
import * as VoteSystem from "../vote-system";

export = new Command
(
	"kick",

	async (message: DiscordJS.Message) =>
	{
		if (VoteSystem.Poll.currentPoll === null)
		{
			VoteSystem.Poll.currentPoll = VoteSystem.Poll.standardPoll(message, "kick", (member: DiscordJS.GuildMember) => member.kick("This person was voted to be kicked"), (2 / 3));

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
