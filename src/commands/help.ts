import { Command, Invocation } from "../command";
import Documentation from "../documentation";
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
				const response = new DiscordJS.RichEmbed();

				response.setColor("40e0d0");
				response.setTitle("All supported commands:");
				response.setDescription(commandManager.CommandsList);
				response.setFooter("Run =help (command) to learn about any command.");

				invocation.Channel.send(response);

				return;
			}

			case 1:
			{
				const commandName: string = invocation.Parameters[0].toLowerCase();

				if (commandManager.SupportedCommands.indexOf(commandName) === -1)
				{
					invocation.Channel.send("There is no `" + commandName + "` command.");
					return;
				}

				const command: Command = commandManager.Commands.get(commandName);
				const doc: Documentation = command.Documentation;
				const response = new DiscordJS.RichEmbed();

				response.setColor("40e0d0");
				response.setTitle(`Command: ${ commandName }`);
				response.addField("Description", doc.description);
				response.addField("Invocation", doc.invocation);

				invocation.Channel.send(response);

				return;
			}

			default:	// There must be at least 2 parameters.
			{
				const commandName: string = invocation.Parameters[0].toLowerCase();

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

				const command: Command = commandManager.Commands.get(commandName);
				const doc: Documentation = command.Documentation;
				const response = new DiscordJS.RichEmbed();

				response.setColor("40e0d0");
				response.setTitle(`Command: ${ commandName }`);
				response.addField(resource, (resource === "Description") ? doc.description : doc.invocation);

				if (invocation.Parameters.length > 2)
				{
					response.setFooter("(You should only use up to two options with this command; the rest are ignored.)");
				}

				invocation.Channel.send(response);

				return;
			}
		}
	}
);
