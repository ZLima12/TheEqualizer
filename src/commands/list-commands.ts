import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";

export = new Command
(
	"list-commands",

	async (invocation: Invocation) =>
	{
		const commandManager = invocation.Client.commandManager;

		let response: string = "";
		response += "**All supported commands:**\n"
		response += '`' + commandManager.CommandsList + "`\n\n";
		response += "Run =help (command) to learn about any command.";

		invocation.Channel.send(response);
	}
);
