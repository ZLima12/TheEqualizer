import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";

export = new Command
(
	"source",

	async (invocation: Invocation) =>
	{
		invocation.Channel.send("My source code is located here: https://github.com/ZLima12/TheEqualizer");
	}
);
