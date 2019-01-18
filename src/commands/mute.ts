import { Command, Invocation } from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll";

export = new Command
(
	"mute",

	async (invocation: Invocation) =>
	{
		if (Array.from(invocation.Member.voiceChannel.members.values()).length <= 1)
		{
			invocation.Channel.send("Can't use this command with only one user in the voice channel...");
			return;
		}

		const pollInGuild = () => Poll.currentPoll.get(invocation.Guild.id);

		if (!pollInGuild())
		{
			Poll.currentPoll.set(invocation.Guild.id, Poll.startPoll(invocation.Message, "mute", (member: DiscordJS.GuildMember) => member.setMute(true), (2 / 3), true));

			if (pollInGuild())
			{
				pollInGuild().start();
			}

			else
			{
				let response: string = "";

				response += "Bad Invocation. From the documentation:\n\n";
				response += invocation.Command.Documentation.invocation;

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
