import Command from "./command";
import * as DiscordJS from "discord.js";

let ping: Command = new Command
(
	"ping",

	(message: DiscordJS.Message) =>
	{
		message.reply("Pong!");

		return Command.ExitStatus.Success;
	}
);

export = ping;