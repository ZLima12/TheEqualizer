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

			await new Promise(resolve => setTimeout(resolve, 100)); // Allow time for Discord to update typing staus.

			try
			{
				result = eval(invocation.Parameters.join(" "));

				invocation.Channel.send("eval() complete. Return value was: `" + result + '`');
			}

			catch (e)
			{
				invocation.Channel.send("eval() failed! Exception thrown was `" + e + '`');
			}

			finally
			{
				setTimeout(() => invocation.Channel.stopTyping(), 100); // Once again, give Discord some time to update typing status.
			}
		}

		else
		{
			invocation.Channel.send("You must be the bot owner to use this command!");
		}
	}
);
