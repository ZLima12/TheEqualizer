import * as DiscordJS from "discord.js";
import Globals from "./globals";
import ConnectionUtils from "./connection-utils";
import Load from "./load";

Globals.ClientInstance = new DiscordJS.Client();

Load().then(ConnectionUtils.loginLoop);
