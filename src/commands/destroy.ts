import Command from "../command";
import * as DiscordJS from "discord.js";
let options = require("../../options");

export = new Command
(
	"destroy",

	async (message: DiscordJS.Message) =>
	{
		if (message.author.id === options.ownerID)
		{
			console.log("Shutting down...");
			message.client.destroy();
			process.exit();
		}

		else return Command.ExitStatus.BadInvocation;
	}
);