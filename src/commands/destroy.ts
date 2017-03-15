import Command from "../command";
import * as DiscordJS from "discord.js";
import Globals from "../globals";

export = new Command
(
	"destroy",

	async (message: DiscordJS.Message) =>
	{
		if (message.author.id === Globals.options.ownerID)
		{
			console.log("Shutting down...");
			message.client.destroy();
			process.exit();
		}

		else return Command.ExitStatus.BadInvocation;
	}
);