import { Command, Invocation} from "../command";
import * as DiscordJS from "discord.js";
import Poll from "../poll"

export = new Command
(
	"cancel",

	async (invocation: Invocation) =>
	{
		const pollInGuild: () => Poll = () =>Poll.currentPoll.get(invocation.Guild.id);

		if ((invocation.Parameters.length === 1 && invocation.Parameters[0] !== "--force") || (invocation.Parameters.length > 1))
		{
			invocation.Channel.send("🤔 This command shouldn't be used with any options (except --force for admins). I'll ignore the extra options.");
		}

		if (!pollInGuild() || !pollInGuild().underway())
		{
			invocation.Channel.send("There is currently no poll being run.");
			return;
		}

		else if (invocation.User.id === pollInGuild().Author.id || (invocation.Member.hasPermission("ADMINISTRATOR") && invocation.Parameters.findIndex((value) => value === "--force") !== -1))
		{
			pollInGuild().send("The vote to " + pollInGuild().Description + " has been canceled.");
			Poll.currentPoll.delete(invocation.Guild.id);
		}

		else if (invocation.Member.hasPermission("ADMINISTRATOR")) // The user also didn't use --force (given previous else if)
		{
			invocation.Channel.send("Because you're an admin, you can cancel the current poll if you run `=cancel --force`.");
		}

		else
		{
			invocation.Channel.send("No can do. Only " + pollInGuild().Author.toString() + " or an admin can cancel the current vote.");
		}
	}
);
