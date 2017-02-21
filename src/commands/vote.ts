import Command from "../command";
import * as DiscordJS from "discord.js";
import * as VoteSystem from "../vote";

let vote: Command = new Command
(
	"vote",

	async (message: DiscordJS.Message) =>
	{
		if (VoteSystem.Poll.currentPoll === null || !VoteSystem.Poll.currentPoll.underway())
		{
			message.reply("There is currently no vote being run.");
			return Command.ExitStatus.BadInvokeNoReply;
		}

		else
		{
			let exitStatus: Command.ExitStatus = VoteSystem.Poll.currentPoll.vote(message);

			if (VoteSystem.Poll.currentPoll.Concluded)
				VoteSystem.Poll.currentPoll = null;

			return exitStatus;
		}
	}
);

export = vote;