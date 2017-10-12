import Command from "../command";
import * as DiscordJS from "discord.js";

export = new Command
(
	"ping",

	async (message: DiscordJS.Message) =>
	{
		message.reply("Pong!");

		return Command.ExitStatus.Success;
	}
);