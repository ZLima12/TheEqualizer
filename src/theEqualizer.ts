import * as DiscordJS from "discord.js";

import * as VoteSystem from "./vote";

const Auth = require("../auth.json");

const client: DiscordJS.Client = new DiscordJS.Client();

let currentPoll: VoteSystem.Poll = null;

client.on
(
	"ready",
	
	() =>
	{
		console.log("ready");
	}
);

client.on
(
	"voiceStateUpdate",
	
	() =>
	{
		if (currentPoll !== null)
		{
			currentPoll.check();
			if (currentPoll.concluded)
				currentPoll = null;
		}
	}
);

client.on
(
	"message",

	(message: DiscordJS.Message) =>
	{
		if (message.content.substring(0,1) === '=')
		{
			let command: Array<string> = message.content.split(' ');
			command[0] = command[0].substring(1);

			switch(command[0])
			{
				case "ping":
					message.reply("Pong!");
					break;

				case "destroy":
					if (message.author.username === "ZLima12")
					{
						message.channel.sendMessage("Shutting down...");
						client.destroy();
						process.exit();
					}
					
					break;

				case "source":
					if (command.length > 1)
						message.reply("If you were looking for my source code, you can find it here:");
					else
						message.reply("My source code is located here:");
					
					message.channel.sendMessage("`https://github.com/ZLima12/TheEqualizer`");

					break;

				case "vote":
					if (currentPoll === null || !currentPoll.underway())
					{
						message.reply("There is currently no vote being run.");
					}

					else
					{
						let voteType = VoteSystem.Vote.voteTypeFromString(command[1]);

						if (command.length !== 2 || voteType === undefined)
						{
							message.reply("Invalid usage of vote. Either `=vote yes` or `=vote no`.");
							break;
						}

						if (currentPoll.votes.get(message.author.id) !== undefined)
						{
							let vote = currentPoll.votes.get(message.author.id);
							
							if (vote.voteType === voteType)
							{
								message.reply("You have already voted, and your previous vote is the same as that one.");
								break;
							}

							vote.voteType = voteType;
							message.reply("You have changed your vote.");

							currentPoll.check();
						}

						currentPoll.votes.set(message.author.id, new VoteSystem.Vote(message.member, voteType));
						
						currentPoll.sendStatus();
						
						currentPoll.check();

						if (currentPoll.concluded)
							currentPoll = null;
					}

					break;

				case "mute":
					if (currentPoll === null)
					{
						currentPoll = VoteSystem.Poll.standardPoll(message, "mute", (member: DiscordJS.GuildMember) => member.setMute(true), (2 / 3));
						if (currentPoll !== null)
							currentPoll.start();
					}

					else
						message.reply("There is already a poll underway.");

					break;

				case "unmute":
					if (currentPoll === null)
					{
						currentPoll = VoteSystem.Poll.standardPoll(message, "unmute", (member: DiscordJS.GuildMember) => member.setMute(false), (2 / 3));

						if (currentPoll !== null)
							currentPoll.start();
					}

					else
						message.reply("There is already a poll underway.");

					break;

				case "cancel":
					if (currentPoll === null || !currentPoll.underway())
					{
						message.reply("There is currently no poll being run.");
						break;
					}

					if (message.author.id === currentPoll.uid || (message.member.hasPermission("ADMINISTRATOR") && command[1] === "--force"))
					{
						currentPoll.sendMessage("The vote to " + currentPoll.desc + " has been canceled.");
						currentPoll = null;
						break;
					}

					message.reply("No can do. Only " + currentPoll.message.author.username + " can cancel the current vote.");

					break;

				default:
					message.reply("What does `" + command[0] + "` mean?");
			}
		}
	}
);

client.login(Auth.key);
