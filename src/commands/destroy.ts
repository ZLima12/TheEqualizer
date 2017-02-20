import Command from "./command";
import * as DiscordJS from "discord.js";
import Globals from "../globals";

let destroy: Command = new Command
(
	"destroy",

	(message: DiscordJS.Message) =>
	{
		if (message.author.id === Globals.options.ownerID)
		{
			console.log("Shutting down...");
			Globals.client.destroy();
			process.exit();
		}

		else return Command.ExitStatus.BadInvocation;
	}
);

export = destroy;