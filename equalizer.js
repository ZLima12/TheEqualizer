const Discord = require('discord.js');

const Auth = require('./auth');

const client = new Discord.Client();

const biasAdmin = false;

class Vote
{
	constructor(member, upvote)
	{
		this.member = member;
		this.modifier = (upvote) ? 1 : -1;
	}
}

class VoteConductor
{
	constructor(message, desc, action, valid, votesNeeded)
	{
		this.message = message;
		this.uid = message.author.id;
		this.desc = desc;
		this.action = action;
		this.stillValid = valid;
		this.votesNeeded = votesNeeded;
		this.votes = [];
	}

	voteCount()
	{
		var count = 0;
		
		for (var i = 0; i < this.votes.length; i++)
			count += this.votes[i].modifier;


		return count;
	}

	underway()
	{
		return (this.votes.length > 0);
	}

	sendMessage(message)
	{
		this.message.channel.sendMessage(message);
	}

	reply(message)
	{
		this.message.reply(message);
	}

	start()
	{
		var message = this.message;

		if (currentVote != null && currentVote.underway())
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
			this.votes.push(new Vote(message.member, true));
			currentVote = this;
			
			this.sendMessage("A vote has been started to " + this.desc + ".");
			this.sendMessage(currentVote.voteCount() + "/" + currentVote.votesNeeded() + " votes.");
			VoteConductor.checkVote();
		}
	}

	static checkVote()
	{
		if (currentVote != null && currentVote.underway())
		{
			if (!currentVote.stillValid())
			{
				currentVote.sendMessage("The vote has been invalidated.");
				currentVote = null;
				return;
			}
	
			if (currentVote.voteCount() >= currentVote.votesNeeded())
			{
				currentVote.sendMessage("The vote to " + currentVote.desc + " has concluded successfully!");
				currentVote.action();
				currentVote = null;
				return;
			}
		}
	}

	static standardVote(message, desc, action, fraction)
	{
		var command = messageToArray(message);

		if (command.length != 2)
		{
			message.reply("Invalid usage. `mute @SomeUser`.");
			return;
		}

		if (currentVote != null && currentVote.underway())
		{
			message.reply("There is already a vote underway.");
			return;
		}

		if (message.member.voiceChannel == null)
		{
			message.reply("You must be in a voice channel to start this vote.");
			return;
		}
		var vc = message.member.voiceChannel;
		
		var memberArray = vc.members.array();
		
		var target = null;

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
						return;
						break;
					
					case false:
						target = member;
						break;
				}
			}
		}

		if (target == null)
		{
			message.reply("No user found by " + command[1] + ".");

			return;
		}
		
		var channel = target.voiceChannel;
		var channelID = target.voiceChannelID;

		currentVote = new VoteConductor
			(
				message,
				desc + " " + command[1],
				
				function()
				{ action(target); },
				
				function()
				{ return target.voiceChannelID == channelID; },
				
				function()
				{ return Math.floor(channel.members.array().length * fraction); }
			);

		currentVote.start();
	}
}

function messageToArray(message)
{
	var arr = message.content.split(" ");
	arr[0] = arr[0].substring(1);
	return arr;
}

var currentVote = null;

client.on("ready", () =>
		{
			console.log("ready");
		}
	 );

client.on("voiceStateUpdate", () =>
		{
			VoteConductor.checkVote();
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
						if (message.author.username  == "ZLima12")
						{
							message.channel.sendMessage("Shutting down...");
							client.destroy();
							process.exit();
						}
						
						break;

					case 'source':
						if (command.length > 1)
							message.reply("If you were looking for my souce code, you can find it here:");
						else
							message.reply("My source code is located here:");

						message.channel.sendMessage("`https://github.com/ZLima12/TheEqualizer`");

						break;

					case 'vote':
						if (currentVote == null || !currentVote.underway())
						{
							message.reply("There is currently no vote being run.");
						}

						else
						{
							var prevVoted = false;
							for (var i = 0; i < currentVote.votes.length; i++)
							{
								var member = currentVote.votes[i];
								if (member.id == message.member.id)
								{
									message.reply("You have already voted.");
									prevVoted = true;
								}
							}

							if (prevVoted) break;

							if (command.length != 2)
							{
								message.reply("Invalid usage of vote. Either `=vote yes` or `=vote no`.");
								break;
							}

							if (command[1].toLowerCase() != "yes" && command[1].toLowerCase() != "no")
							{
								message.reply("Invalid usage of vote. Either `=vote yes` or `=vote no`.");
								break;
							}

							currentVote.votes.push(new Vote(message.member, (command[1].toLowerCase() == "yes")));
							
							message.channel.sendMessage(currentVote.voteCount() + "/" + currentVote.votesNeeded() + " votes.");
							
							VoteConductor.checkVote();
						}

						break;

					case 'mute':
						VoteConductor.standardVote(message, "mute", function(member) { member.setMute(true); }, (2 / 3));

						break;

					case 'unmute':
						VoteConductor.standardVote(message, "unmute", function(member) {member.setMute(false); }, (2 / 3));
						break;

					case 'cancel':
						if (currentVote == null || !currentVote.underway())
						{
							message.reply("There is currently no vote being run.");
							break;
						}

						if (message.author.id == currentVote.uid)
						{
							currentVote.sendMessage("The vote to " + currentVote.desc + " has been canceled.");
							currentVote = null;
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
