import Command from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll";

export = new Command
(
	"vote",

	async (message: DiscordJS.Message) =>
	{
		if (!Poll.currentPoll.get(message.guild.id) || !Poll.currentPoll.get(message.guild.id).underway())
		{
			message.reply("There is currently no vote being run.");
			return Command.ExitStatus.BadInvokeNoReply;
		}

		else
		{
			let exitStatus: Command.ExitStatus = Poll.currentPoll.get(message.guild.id).vote(message);

			return exitStatus;
		}
	}
);
