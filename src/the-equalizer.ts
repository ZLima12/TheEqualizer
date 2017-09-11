import * as DiscordJS from "discord.js";
import Command from "./command";
import * as VoteSystem from "./vote-system";
import Moderation from "./moderation";
import Globals from "./globals";

Command.loadCommandsSync();

let options = require("../options");
Globals.Options = options;

let client = new DiscordJS.Client();
Globals.ClientInstance = client;

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
	"voiceStateUpdate",

	(oldMember: DiscordJS.GuildMember, newMember: DiscordJS.GuildMember) =>
	{
		if (Moderation.DoNotDisturb.moveUserIfAfk(newMember)) return;

		Moderation.DoNotDisturb.restoreChannelIfReturned(newMember);
		Moderation.DoNotDisturb.verifyPreviousChannelEntry(newMember);
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

let dndTimerID = setInterval
(
	() =>
	{
		Moderation.DoNotDisturb.moveAllAfkToDnd(client.guilds.array());
		Moderation.DoNotDisturb.verifyAllPreviousChannelEntries();
	},

	2000
);

function loginLoop()
{
	client.login(options.auth).catch(() => setTimeout(loginLoop, 500));
}

loginLoop();
