import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";
import Globals from "../globals";

export = new Command
(
	"eval",

	async (invocation: Invocation) =>
	{
		if (invocation.User.id === Globals.Options["ownerID"])
		{
			if (invocation.Parameters.length === 0)
			{
				invocation.Channel.send("😅 I need code to execute...");
				return;
			}

			let result;
			invocation.Channel.startTyping();
			try
			{
				result = eval(invocation.Parameters.join(" "));
			}

			catch (e)
			{
				invocation.Channel.send("eval() failed! Exception thrown was `" + e + '`');
				invocation.Channel.stopTyping();
			}
			invocation.Channel.stopTyping();

			invocation.Channel.send("eval() complete. Return value was: `" + result + '`');
		}

		else
		{
			invocation.Channel.send("You must be the bot owner to use this command!");
		}
	}
);
