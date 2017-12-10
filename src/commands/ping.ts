import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";

export = new Command
(
	"ping",

	async (invocation: Invocation) =>
	{
		invocation.Channel.send("Pong!");
	}
);
