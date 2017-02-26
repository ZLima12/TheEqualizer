import * as DiscordJS from "discord.js";
import Command from "./command";
import * as VoteSystem from "./vote-system";
import Globals from "./globals";
import * as IsOnline from "is-online";

Command.loadCommandsSync();

Globals.options = require("../options.json");

Globals.client = new DiscordJS.Client();

async function loginWaiter()
{
	console.log("Waiting for a connection to Discord before logging in...");
	for (let firstTry = true; ; firstTry = false)
	{
		let result = await IsOnline
		(
			{
				timeout: 5000,
				hostnames:
				[
					"https://discordapp.com"
				]
			}
		);

		if (result)
		{
			Globals.client.login(Globals.options.auth);
			console.log("Connected!");
			break;
		}

		else if (!firstTry)
		{
			console.log("Couldn't connect... trying again!");
		}
	}
}

Globals.client.on
(
	"ready",
	
	() =>
	{
		console.log("Ready!");
		Globals.client.user.setGame(Globals.motd);
	}
);

Globals.client.on
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

Globals.client.on
(
	"message",

	(message: DiscordJS.Message) =>
	{
		if (message.author.id !== Globals.client.user.id)
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

loginWaiter();