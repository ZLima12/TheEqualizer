import * as DiscordJS from "discord.js";
import Command from "./command";
import * as VoteSystem from "./vote-system";
import Moderation from "./moderation";

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

client.on
(
	"voiceStateUpdate",

	(oldMember: DiscordJS.GuildMember, newMember: DiscordJS.GuildMember) =>
	{
		Moderation.DoNotDisturb.moveUserIfAfk(newMember);
	}
);

function getGuildArray(): Array<DiscordJS.Guild>
{
	let guilds: Array<DiscordJS.Guild> = new Array<DiscordJS.Guild>();

	for (let guild of client.guilds.values())
	{
		guilds.push(guild);
	}

	return guilds;
}

let dndTimerID = setInterval(() => Moderation.DoNotDisturb.moveAllAfkToDnd(getGuildArray()), 2000);

function loginLoop()
{
	client.login(options.auth).catch(() => setTimeout(loginLoop, 500));
}

loginLoop();
