import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll";

export = new Command
(
	"unmute",

	async (invocation: Invocation) =>
	{
		const pollInGuild = () => Poll.currentPoll.get(invocation.Guild.id);

		if (!pollInGuild())
		{
			Poll.currentPoll.set(invocation.Guild.id, Poll.startPoll(invocation.Message, "unmute", (member: DiscordJS.GuildMember) => member.setMute(false), (2 / 3), true));

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
