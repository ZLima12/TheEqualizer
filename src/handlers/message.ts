import EventHandler from "../event-handler";
import * as DiscordJS from "discord.js";
import Command from "../command";

export = new EventHandler
(
	"message",

	(message: DiscordJS.Message) =>
	{
		if (!message.author.bot)
		{
			if (message.channel.type !== "text")
			{
				message.reply("Sorry, but I can only be used in servers.");
				return;
			}

			if (message.content.startsWith('='))
			{
				Command.runCommand(message);
			}
		}
	}
);
