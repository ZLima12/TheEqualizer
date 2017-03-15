import Command from "../command";
import * as DiscordJS from "discord.js";
let options = require("../../options");

export = new Command
(
	"eval",

	async (message: DiscordJS.Message) =>
	{
		let command: Array<string> = Command.messageToArray(message);
		if (message.content.indexOf(' ') == -1)
			return Command.ExitStatus.BadInvocation;
		
		if (message.author.id === options.ownerID)
		{
			let result;
			message.channel.startTyping();
			try
			{
				result = eval(message.content.substring(message.content.indexOf(' ') + 1));
			}
			
			catch (e)
			{
				message.reply("eval() failed! Exception thrown was `" + e + '`');
				message.channel.stopTyping();
				return Command.ExitStatus.BadInvokeNoReply;
			}
			message.channel.stopTyping();
			
			message.reply("eval() complete. Return value was: `" + result + '`');
			return Command.ExitStatus.Success;
		}

		else
			return Command.ExitStatus.BadInvocation;
	}
);