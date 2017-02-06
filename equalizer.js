const Discord = require('discord.js');

const Auth = require('./auth');

const client = new Discord.Client();

const biasAdmin = false;

class Vote
{
	constructor()
	{
		this.action = null;
		this.message = null;
		this.stillValid = null;
		this.votesNeeded = null;
		this.votes = null;
		this.desc = null;
		this.votedMembers = null;
	}

	isClean()
	{
		return this.action == null &&
			this.message == null &&
			this.stillValid == null &&
			this.votesNeeded == null &&
			this.desc == null &&
			this.votedMembers == null &&
			this.votes == null;
	}

	clearVars()
	{
		this.action = null;
		this.message = null;
		this.stillValid = null;
		this.votesNeeded = null;
		this.votes = null;
		this.desc = null;
		this.votedMembers = null;
	}

	static startVote(message, desc, action, valid, votesNeeded)
	{
		if (!currentVote.isClean())
		{
			message.reply("A vote to " + currentVote.desc + " is currently underway. ");
		}
	
		else if (message.channel.type != "text")
		{
			message.reply("I'm not quite sure what to do in this context...");
			return;
		}
	
		else
		{
			currentVote.action = action;
			currentVote.message = message;
			currentVote.stillValid = valid;
			currentVote.votesNeeded = votesNeeded;
			currentVote.votes = 1;
			currentVote.desc = desc;
			currentVote.votedMembers = [message.member];
			
			message.channel.sendMessage("A vote has been started to " + desc + ".");
			message.channel.sendMessage(currentVote.votes + "/" + currentVote.votesNeeded() + " votes.");
			Vote.checkVote();
		}
	}

	static checkVote()
	{
		if (!currentVote.isClean())
		{
			if (!currentVote.stillValid())
			{
				currentVote.message.channel.sendMessage("The vote has been invalidated.");
				currentVote.clearVars();
				return;
			}
	
			if (currentVote.votes >= currentVote.votesNeeded())
			{
				currentVote.message.channel.sendMessage("The vote to " + currentVote.desc + " has concluded successfully!");
				currentVote.action();
				currentVote.clearVars();
				return;
			}
		}
	}
}

var currentVote = new Vote();

client.on("ready", () =>
		{
			console.log("ready");
		}
	 );

client.on("voiceStateUpdate", () =>
		{
			Vote.checkVote();
		}
	 );

client.on("message", message =>
		{
			if (message.content.substring(0,1) == '=')
			{
				var command = message.content.split(" ");

				command[0] = command[0].substring(1);

				switch(command[0])
				{
					case 'ping':
						message.reply("Pong!");
						break;

					case 'destroy':
						if (message.author.username == "ZLima12")
						{
							message.channel.sendMessage("Shutting down...");
							client.destroy();
							process.exit();
						}
						
						break;

					case 'vote':
						if (currentVote.isClean())
						{
							message.reply("There is currently no vote being run.");
						}

						else
						{
							var prevVoted = false;
							for (var i = 0; i < currentVote.votedMembers.length; i++)
							{
								var member = currentVote.votedMembers[i];
								if (member.id == message.member.id)
								{
									message.reply("You have already voted.");
									prevVoted = true;
								}
							}

							if (prevVoted) break;

							if (command.length != 2)
							{
								message.reply("Invalid usage of vote. Either `!vote yes` or `!vote no`.");
								break;
							}

							if (command[1].toLowerCase() != "yes" && command[1].toLowerCase() != "no")
							{
								message.reply("Invalid usage of vote. Either `!vote yes` or `!vote no`.");
								break;
							}

							currentVote.votes += (command[1].toLowerCase() == "yes") ? 1 : -1;
							currentVote.votedMembers.push(message.member);
							
							message.channel.sendMessage(currentVote.votes + "/" + currentVote.votesNeeded() + " votes.");
							
							checkVote();
						}

						break;

					case 'mute':
						if (command.length != 2)
						{
							message.reply("Invalid usage. `mute @SomeUser`.");
							break;
						}

						if (!currentVote.isClean())
						{
							message.reply("There is already a vote underway.");
							break;
						}

						if (message.member.voiceChannel == null)
						{
							message.reply("You must be in a voice channel to start this vote.");
							break;
						}
						var vc = message.member.voiceChannel;
						
						var memberArray = vc.members.array();
						
						var target = null;

						var quit = false;

						for (var member of memberArray)
						{
							if ("<@" + member.user.id + ">" == command[1])
								target = member;

							else if ("<@!" + member.user.id + ">" == command[1])
							{
								switch (biasAdmin)
								{
									case true:
										message.reply("No can do, all praise " + command[1] + ".");
										quit = true;
										break;
									
									case false:
										target = member;
										break;
								}
							}
						}

						if (quit) break;

						if (target == null)
						{
							message.reply("No user found by " + command[1] + ".");

							break;
						}
						
						var channel = target.voiceChannel;
						var channelID = target.voiceChannelID;

						Vote.startVote(message, "mute " + command[1], function() { target.setMute(true); }, function()
								{
									return target.voiceChannelID == channelID;
								},
								
								function()
								{
									return Math.floor(channel.members.array().length * 2 / 3);
								}
						    );

						break;

					case 'unmute':
						if (command.length != 2)
						{
							message.reply("Invalid usage. `unmute @SomeUser`.");
							break;
						}

						if (!currentVote.isClean())
						{
							message.reply("There is already a vote underway.");
							break;
						}

						if (message.member.voiceChannel == null)
						{
							message.reply("You must be in a voice channel to start this vote.");
							break;
						}

						var vc = message.member.voiceChannel;
						
						var memberArray = vc.members.array();
						
						var target = null;

						var quit = false;

						for (var member of memberArray)
						{
							if ("<@" + member.user.id + ">" == command[1])
								target = member;


							else if ("<@!" + member.user.id + ">" == command[1])
							{
								switch (biasAdmin)
								{
									case true:
										message.reply("No can do, all praise " + command[1] + ".");
										quit = true;
										break;
									
									case false:
										target = member;
										break;
								}
							}
						}

						if (quit) break;

						if (target == null)
						{
							message.reply("No user found by " + command[1] + ".");
							break;
						}
						
						var channel = target.voiceChannel;
						var channelID = target.voiceChannelID;

						Vote.startVote(message, "unmute " + command[1], function() { target.setMute(false); }, function()
								{
									return target.voiceChannelID == channelID;
								},
								
								function()
								{
									return Math.floor(channel.members.array().length * 2 / 3);
								}
						    );

						break;

					case 'cancel':
						if (currentVote.isClean())
						{
							message.reply("There is currently no vote being run.");
							break;
						}

						if (message.author.id == currentVote.message.author.id)
						{
							currentVote.message.channel.sendMessage("The vote to " + currentVote.desc + " has been canceled.");
							currentVote.clearVars();
							break;
						}

						message.reply("No can do. Only " + currentVote.message.author.username + " can cancel the current vote.");


						break;

					default:
						message.reply("What does \"" + command[0] + "\" mean?");
				}
			}
		}
	 );

client.login(Auth.key);
