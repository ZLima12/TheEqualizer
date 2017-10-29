import Command from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll"

export = new Command
(
	"cancel",

	async (message: DiscordJS.Message) =>
	{
		let command: Array<string> = Command.messageToArray(message);

		if (Poll.currentPoll === null || !Poll.currentPoll.underway())
		{
			message.reply("There is currently no poll being run.");
			return Command.ExitStatus.BadInvocation;
		}

		if (message.author.id === Poll.currentPoll.Author.id || (message.member.hasPermission("ADMINISTRATOR") && command[1] === "--force"))
		{
			Poll.currentPoll.send("The vote to " + Poll.currentPoll.Description + " has been canceled.");
			Poll.currentPoll = null;
			return Command.ExitStatus.Success;
		}

		message.reply("No can do. Only " + Poll.currentPoll.Author.user.username + " can cancel the current vote.");

		return Command.ExitStatus.BadInvocation;
	}
);
