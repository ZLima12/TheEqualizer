import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll";

export = new Command
(
	"kick",

	async (invocation: Invocation) =>
	{
		const pollInGuild = () => Poll.currentPoll.get(invocation.Guild.id);

		if (!pollInGuild())
		{
			Poll.currentPoll.set(invocation.Guild.id, Poll.startPoll(invocation.Message, "kick", (member: DiscordJS.GuildMember) => member.kick("This person was voted to be kicked"), (2 / 3), false, (1/2)));

			if (pollInGuild())
			{
				pollInGuild().start();
			}

			else
			{
				let response: string = "";

				response += "Bad Invocation. From the documentation:\n\n";
				response += invocation.Command.Documentation.Invocation;

				invocation.Channel.send(response);

				return;
			}
		}

		else
		{
			invocation.Channel.send("There is already a poll underway. (Tell " + pollInGuild().Author.toString() + " or an admin to `=cancel` it.)");
			return;
		}
	}
);
