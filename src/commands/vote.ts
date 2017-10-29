import Command from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll";

export = new Command
(
	"vote",

	async (message: DiscordJS.Message) =>
	{
		if (Poll.currentPoll === null || !Poll.currentPoll.underway())
		{
			message.reply("There is currently no vote being run.");
			return Command.ExitStatus.BadInvokeNoReply;
		}

		else
		{
			let exitStatus: Command.ExitStatus = Poll.currentPoll.vote(message);

			if (Poll.currentPoll.Concluded)
				Poll.currentPoll = null;

			return exitStatus;
		}
	}
);
