/*jshint esversion: 6 */

const biasAdmin = false;

class Vote
{
	constructor(member, upvote)
	{
		this.member = member;
		this.modifier = (upvote) ? 1 : -1;
	}
}

class Poll
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
		this.concluded = false;
	}

	voteCount()
	{
		var count = 0;
		
		for (var vote of this.votes)
			count += vote.modifier;


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
		if (this.message.channel.type != "text")
		{
			this.message.reply("I'm not quite sure what to do in this context...");
			return;
		}
	
		else
		{
			this.votes.push(new Vote(this.message.member, true));
			
			this.sendMessage("A poll has been started to " + this.desc + '.');
			this.sendMessage(this.voteCount() + '/' + this.votesNeeded() + " votes.");
			this.check();
		}
	}

	end(message = "The poll has ended.")
	{
		this.concluded = true;

		this.sendMessage(message);
	}

	check()
	{
		if (this.concluded) ;

		else if (!this.stillValid())
		{
			this.sendMessage("The poll has been invalidated.");
		}
		
		else if (this.voteCount() >= this.votesNeeded())
		{
			this.action();
			this.end("The poll to " + this.desc + " has concluded successfully!");
		}
	}

	static standardPoll(message, desc, action, fraction)
	{
		var command = messageToArray(message);

		if (command.length != 2)
		{
			message.reply("Invalid usage. `=" + this.desc + " @SomeUser`.");
			return null;
		}

		if (message.member.voiceChannel === undefined)
		{
			message.reply("You must be in a voice channel to start this vote.");
			return null;
		}

		var voiceChannel = message.member.voiceChannel;
		
		var target = null;

		for (var member of voiceChannel.members.array())
		{
			if ("<@" + member.user.id + '>' == command[1])
				target = member;

			else if ("<@!" + member.user.id + '>' == command[1])
			{
				switch (biasAdmin)
				{
					case true:
						message.reply("No can do, all praise " + command[1] + '.');
						return;
					
					case false:
						target = member;
						break;
				}
			}
		}

		if (target === null)
		{
			message.reply("No user found by " + command[1] + '.');

			return null;
		}

		return new Poll
			(
				message,
				desc + ' ' + command[1],
				
				function()
				{ action(target); },
				
				function()
				{
					return target.voiceChannelID == message.member.voiceChannelID;
				},
				
				function()
				{ return Math.floor(voiceChannel.members.array().length * fraction); }
			);
	}
}

function messageToArray(message)
{
	var arr = message.content.split(' ');
	arr[0] = arr[0].substring(1);
	return arr;
}


module.exports =
{
	Poll: Poll,
	Vote: Vote
};
