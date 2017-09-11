import * as DiscordJS from "discord.js";
import EventHandler from "./event-handler";
import Command from "./command";
import * as VoteSystem from "./vote-system";
import Moderation from "./moderation";
import Globals from "./globals";
import ConnectionUtils from "./connection-utils";

Command.loadCommandsSync();
EventHandler.loadHandlersSync();

let options = require("../options");
Globals.Options = options;

let client = new DiscordJS.Client();
Globals.ClientInstance = client;

EventHandler.setHandlersSync(client);

let dndTimerID = setInterval
(
	() =>
	{
		Moderation.DoNotDisturb.moveAllAfkToDnd(client.guilds.array());
		Moderation.DoNotDisturb.verifyAllPreviousChannelEntries();
	},

	2000
);

ConnectionUtils.loginLoop();
