import * as DiscordJS from "discord.js";
import Command from "./command";
import * as VoteSystem from "./vote-system";

Command.loadCommandsSync();

let options = require("../options");

let client = new DiscordJS.Client();

client.on
(
	"ready",

	() =>
	{
		console.log("Ready!");
		client.user.setGame(options.motd);
	}
);

client.on
(
	"voiceStateUpdate",

	() =>
	{
		if (VoteSystem.Poll.currentPoll !== null)
		{
			VoteSystem.Poll.currentPoll.check();
			if (VoteSystem.Poll.currentPoll.Concluded)
				VoteSystem.Poll.currentPoll = null;
		}
	}
);

client.on
(
	"disconnect",

	() =>
	{
		console.log("Bot disconnected, destroying and reconnecting...");
		client.destroy();

		setTimeout
		(
			() => client.login(options.auth),

			500
		);
	}
);

client.on
(
	"message",

	(message: DiscordJS.Message) =>
	{
		if (message.author.id !== message.client.user.id)
		{
			if (message.channel.type !== "text")
			{
				message.reply("Sorry, but I can only be used in servers currently.");
				return;
			}

			if (message.content.startsWith('='))
			{
				Command.runCommand(message);
			}
		}
	}
);

function loginLoop()
{
	client.login(options.auth).catch(() => setTimeout(loginLoop, 500));
}

loginLoop();
