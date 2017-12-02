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

		message.reply("Here is the list of all supported commands:\n" + commandList.trim() + "\nTo learn more about any command, use the `help` command.");
		return Command.ExitStatus.Success;
	}
);
