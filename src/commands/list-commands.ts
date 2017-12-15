import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";

export = new Command
(
	"list-commands",

	async (invocation: Invocation) =>
	{
		const commandManager = invocation.Client.commandManager;

		const response = new DiscordJS.RichEmbed();

		response.setColor("40e0d0");
		response.setTitle("All supported commands:");
		response.setDescription(commandManager.CommandsList);
		response.setFooter("Run =help (command) to learn about any command.");

		invocation.Channel.send(response);
	}
);
