import Command from "../command";
import * as DiscordJS from "discord.js";
import * as VoteSystem from "../vote";

export = new Command
(
	"cancel",

	async (message: DiscordJS.Message) =>
	{
		let command: Array<string> = Command.messageToArray(message);
		
		if (VoteSystem.Poll.currentPoll === null || !VoteSystem.Poll.currentPoll.underway())
		{
			message.reply("There is currently no poll being run.");
			return Command.ExitStatus.BadInvocation;
		}

		if (message.author.id === VoteSystem.Poll.currentPoll.Author.id || (message.member.hasPermission("ADMINISTRATOR") && command[1] === "--force"))
		{
			VoteSystem.Poll.currentPoll.sendMessage("The vote to " + VoteSystem.Poll.currentPoll.Description + " has been canceled.");
			VoteSystem.Poll.currentPoll = null;
			return Command.ExitStatus.Success;
		}

		message.reply("No can do. Only " + VoteSystem.Poll.currentPoll.Author.user.username + " can cancel the current vote.");

		return Command.ExitStatus.BadInvocation;
	}
);