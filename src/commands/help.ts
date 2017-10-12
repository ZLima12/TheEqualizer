import Command from "../command";
import Documentation from "../doc-container";
import * as DiscordJS from "discord.js";

export = new Command
(
	"help",

	async (message: DiscordJS.Message) =>
	{
		let command: Array<string> = Command.messageToArray(message);
		let commandName: string = undefined;
		let doc: Documentation = undefined;
		switch (command.length)
		{
			case 1:
				Command.loadedCommands.get("list-commands").Action(message);

				message.reply("(If you want to learn how to use the `help` command, run `=help help`)");
				break;

			case 2:
				commandName = command[1].toLowerCase();

				if (Command.SupportedCommands.indexOf(commandName) === -1)
					return Command.ExitStatus.BadInvocation;

				doc = Command.loadedCommands.get(commandName).Documentation;
				message.reply("Description of `" + commandName + "`:\n" + doc.Description + "\n\nInvocation of `" + commandName + "`:\n" + doc.Invocation);

				break;

			case 3:
				commandName = command[1].toLowerCase();
				let resource: string = undefined;

				if (Command.SupportedCommands.indexOf(commandName) === -1)
					return Command.ExitStatus.BadInvocation;

				if (command[2].toLowerCase() === "description" || command[2].toLowerCase() === "invocation")
					resource = command[2].toLowerCase();

				if (resource === undefined)
					return Command.ExitStatus.BadInvocation;

				doc = Command.loadedCommands.get(command[1]).Documentation;
				let isDescription: boolean = resource === "description";
				message.reply((isDescription ? "Description" : "Invocation") + " of " + commandName + ":\n" + (isDescription ? doc.Description : doc.Invocation));

				break;
		}

		return Command.ExitStatus.Success;
	}
);
