import Command from "../command";
import * as DiscordJS from "discord.js";

export = new Command
(
	"list-commands",

	async (message: DiscordJS.Message) =>
	{
		let commandList: string = "";
		for (let command of Command.SupportedCommands)
			commandList += '`' + command + "`\n";

		if (commandList.endsWith('\n'))
			commandList = commandList.substring(0, commandList.length - 1);

		message.reply("Here is the list of all supported commands:\n" + commandList + "\nTo learn more about any command, use the `help` command.");
		return Command.ExitStatus.Success;
	}
);
