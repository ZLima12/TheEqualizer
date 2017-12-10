import { Command, Invocation } from "../command";
import Documentation from "../doc-container";
import * as DiscordJS from "discord.js";

export = new Command
(
	"help",

	async (invocation: Invocation) =>
	{
		const commandManager = invocation.Client.commandManager;

		switch (invocation.Parameters.length)
		{
			case 0:
			{
				let response: string = "";
				response += "**All supported commands:**\n";
				response += '`' + commandManager.CommandsList + "`\n\n";
				response += "Run =help (command) to learn about any command.";

				invocation.Channel.send(response);

				return;
			}

			case 1:
			{
				let commandName: string = invocation.Parameters[0].toLowerCase();

				if (commandManager.SupportedCommands.indexOf(commandName) === -1)
				{
					invocation.Channel.send("There is no `" + commandName + "` command.");
					return;
				}

				let command: Command = commandManager.Commands.get(commandName);
				let doc: Documentation = command.Documentation;

				let response: string = "";

				response += "**Description of `" + commandName + "`:**\n";
				response += doc.Description + "\n\n";
				response += "**Invocation of `" + commandName + "`:**\n";
				response += doc.Invocation;

				invocation.Channel.send(response);

				return;
			}

			default:	// There must be at least 2 parameters.
			{
				let commandName: string = invocation.Parameters[0].toLowerCase();

				if (commandManager.SupportedCommands.indexOf(commandName) === -1)
				{
					invocation.Channel.send("There is no `" + commandName + "` command.");
					return;
				}

				let resource: string;

				switch (invocation.Parameters[1].toLowerCase())
				{
					case "description":
					{
						resource = "Description";
						break;
					}

					case "invocation":
					{
						resource = "Invocation";
						break;
					}

					default:
					{
						invocation.Channel.send("You can either get the description or invocation for `" + commandName + "`. (Not `" + invocation.Parameters[1] + "`.)");
						return;
					}
				}

				let command: Command = commandManager.Commands.get(commandName);
				let doc: Documentation = command.Documentation;
				let response: string = "";

				response += "**" + resource + " of `" + commandName + "`:**\n";
				response += (resource === "Description") ? doc.Description : doc.Invocation;

				if (invocation.Parameters.length > 2)
				{
					response += "\n\n";
					response += "(You should only use up to two options with this command; the rest are ignored.)";
				}

				invocation.Channel.send(response);

				return;
			}
		}
	}
);
