import Command from "../command";
import * as DiscordJS from "discord.js";
import * as VoteSystem from "../vote-system";

export = new Command
(
	"unmute",

	async (message: DiscordJS.Message) =>
	{
		if (VoteSystem.Poll.currentPoll === null)
		{
<<<<<<< HEAD
			VoteSystem.Poll.currentPoll = VoteSystem.Poll.voicePoll(message, "unmute", (member: DiscordJS.GuildMember) => member.setMute(false), (2 / 3));
=======
			VoteSystem.Poll.currentPoll = VoteSystem.Poll.standardPoll(message, "unmute", (member: DiscordJS.GuildMember) => member.setMute(false), (2 / 3));
>>>>>>> a8e3a0994c58d9d9b5f1a276987ac0c9faa21884

			if (VoteSystem.Poll.currentPoll !== null)
			{
				VoteSystem.Poll.currentPoll.start();
				return Command.ExitStatus.Success;
			}

			else
				return Command.ExitStatus.BadInvocation;
		}

		else
		{
			message.reply("There is already a poll underway.");
			return Command.ExitStatus.BadInvocation;
		}
	}
);