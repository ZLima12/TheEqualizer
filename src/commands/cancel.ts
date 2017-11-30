import Command from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll"

export = new Command
(
	"cancel",

	async (message: DiscordJS.Message) =>
	{
		let command: Array<string> = Command.messageToArray(message);

		if (!Poll.currentPoll.get(message.guild.id) || !Poll.currentPoll.get(message.guild.id).underway())
		{
			message.reply("There is currently no poll being run.");
			return Command.ExitStatus.BadInvocation;
		}

		if (message.author.id === Poll.currentPoll.get(message.guild.id).Author.id || (message.member.hasPermission("ADMINISTRATOR") && command[1] === "--force"))
		{
			Poll.currentPoll.get(message.guild.id).send("The vote to " + Poll.currentPoll.get(message.guild.id).Description + " has been canceled.");
			Poll.currentPoll.delete(message.guild.id);
			return Command.ExitStatus.Success;
		}

		message.reply("No can do. Only " + Poll.currentPoll.get(message.guild.id).Author.user.username + " can cancel the current vote.");

		return Command.ExitStatus.BadInvocation;
	}
);
