const Discord = require('discord.js');

const Auth = require('./auth');

const client = new Discord.Client();

var currentVote =
{
	action: null,
	message: null,
	stillValid: null,
	votesNeeded: null,
	votes: null,
	desc: null,
	votedMembers: null,

	isClean: function()
	{
		return this.action == null &&
			this.message == null &&
			this.stillValid == null &&
			this.votesNeeded == null &&
			this.desc == null &&
			this.votedMembers == null &&
			this.votes == null;
	},

	clearVars: function()
	{
		this.action = null;
		this.message = null;
		this.stillValid = null;
		this.votesNeeded = null;
		this.votes = null;
		this.desc = null;
		this.votedMembers = null;
	}
}

function startVote(message, desc, action, valid, votesNeeded)
{
	if (!currentVote.isClean())
	{
		message.channel.sendMessage("A vote to " + currentVote.desc + " is currently underway. ");
	}

	else if (message.channel.type != "text")
	{
		message.channel.sendMessage("I'm not quite sure what to do in this context...");
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
		checkVote();
	}
}

function checkVote()
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

client.on("ready", () =>
		{
			console.log("ready");
		}
	 );

client.on("voiceStateUpdate", () =>
		{
			checkVote();
		}
	 );

client.on("message", message =>
		{
			if (message.content.substring(0,1) == '!')
			{
				var command = message.content.split(" ");

				command[0] = command[0].substring(1);

				switch(command[0])
				{
					case 'ping':
						message.channel.sendMessage("Pong!");
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
							message.channel.sendMessage("There is currently no vote being run.");
						}

						else
						{
							for (var member in currentVote.votedMembers)
							{
								if (member.id == message.member.id)
								{
									message.reply("You have already voted.");
									break;
								}
							}

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
							message.reply("Invalid usage. `mute SomeUser#1234`.");
							break;
						}

						if (!currentVote.isClean())
						{
							message.channel.sendMessage("There is already a vote going on.");
							break;
						}

						var vc = message.member.voiceChannel;
						
						var memberArray = vc.members.array();
						
						var target = null;
						for (var member of memberArray)
						{
							if (member.user.username + "#" + member.user.discriminator == command[1])
								target = member;
						}

						if (target == null)
						{
							message.reply("No user found by " + command[1] + ".");
							break;
						}
						
						var channel = target.voiceChannel;
						var channelID = target.voiceChannelID;

						startVote(message, "mute " + command[1], function() { target.setMute(true); }, function()
								{
									return target.voiceChannelID == channelID;
								},
								
								function()
								{
									return channel.members.array().length;
								}
						    );

						break;

					case 'unmute':
						if (command.length != 2)
						{
							message.reply("Invalid usage. `unmute SomeUser#1234`.");
							break;
						}

						if (!currentVote.isClean())
						{
							message.channel.sendMessage("There is already a vote going on.");
							break;
						}

						var vc = message.member.voiceChannel;
						
						var memberArray = vc.members.array();
						
						var target = null;
						for (var member of memberArray)
						{
							if (member.user.username + "#" + member.user.discriminator == command[1])
								target = member;
						}

						if (target == null)
						{
							message.reply("No user found by " + command[1] + ".");
							break;
						}
						
						var channel = target.voiceChannel;
						var channelID = target.voiceChannelID;

						startVote(message, "unmute " + command[1], function() { target.setMute(false); }, function()
								{
									return target.voiceChannelID == channelID;
								},
								
								function()
								{
									return channel.members.array().length;
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
						message.channel.sendMessage("What does \"" + command[0] + "\" mean?");
				}
			}
		}
	 );

client.login(Auth.key);
