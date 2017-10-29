import Command from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll";

export = new Command
(
	"kick",

	async (message: DiscordJS.Message) =>
	{
		if (Poll.currentPoll === null)
		{
			Poll.currentPoll = Poll.startPoll(message, "kick", (member: DiscordJS.GuildMember) => member.kick("This person was voted to be kicked"), (2 / 3), false, (1/2));

			if (Poll.currentPoll !== null)
			{
				Poll.currentPoll.start();
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
