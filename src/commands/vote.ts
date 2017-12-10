import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll";

export = new Command
(
	"vote",

	async (invocation: Invocation) =>
	{
		const pollInGuild = () => Poll.currentPoll.get(invocation.Guild.id);

		if (!pollInGuild() || !pollInGuild().underway())
		{
			invocation.Channel.send("There is currently no poll being run.");
			return;
		}

		else
		{
			pollInGuild().vote(invocation.Message);
		}
	}
);
