import * as DiscordJS from "discord.js";

import * as VoteSystem from "./vote";

const Auth = require("../auth.json");

const client: DiscordJS.Client = new DiscordJS.Client();

let currentPoll: VoteSystem.Poll = null;

client.on("ready", () =>
		{
			console.log("ready");
		}
	 );

client.on("voiceStateUpdate", () =>
		{
			if (currentPoll !== null)
			{
				currentPoll.check();
				if (currentPoll.concluded)
					currentPoll = null;
			}
		}
	 );

client.on("message", (message) =>
		{
			if (message.content.substring(0,1) == '=')
			{
				let command: Array<string> = message.content.split(' ');
				command[0] = command[0].substring(1);

				switch(command[0])
				{
					case "ping":
						message.reply("Pong!");
						break;

					case "destroy":
						if (message.author.username == "ZLima12")
						{
							message.channel.sendMessage("Shutting down...");
							client.destroy();
							process.exit();
						}
						
						break;

					case "source":
						if (command.length > 1)
							message.reply("If you were looking for my souce code, you can find it here:");
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
							let prevVoted: boolean = false;
							for (let vote of currentPoll.votes)
							{
								let member: DiscordJS.GuildMember = vote.member;
								if (member.id == message.member.id)
								{
									message.reply("You have already voted.");
									prevVoted = true;
								}
							}

							if (prevVoted) break;

							if (command.length != 2 || (command[1].toLowerCase() != "yes" && command[1].toLowerCase() != "no"))
							{
								message.reply("Invalid usage of vote. Either `=vote yes` or `=vote no`.");
								break;
							}

							currentPoll.votes.push(new VoteSystem.Vote(message.member, (command[1].toLowerCase() == "yes")));
							
							message.channel.sendMessage(currentPoll.voteCount() + "/" + currentPoll.votesNeeded() + " votes.");
							
							currentPoll.check();

							if (currentPoll.concluded)
								currentPoll = null;
						}

						break;

					case "mute":
						if (currentPoll === null)
						{
							currentPoll = VoteSystem.Poll.standardPoll(message, "mute", function(member) { member.setMute(true); }, (2 / 3));
							if (currentPoll !== null)
								currentPoll.start();
						}

						else
							message.reply("There is already a poll underway.");

						break;

					case "unmute":
						if (currentPoll === null)
						{
							currentPoll = VoteSystem.Poll.standardPoll(message, "unmute", function(member) { member.setMute(false); }, (2 / 3));

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

						if (message.author.id == currentPoll.uid)
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
