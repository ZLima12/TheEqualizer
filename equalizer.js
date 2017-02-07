const Discord = require('discord.js');

const Auth = require('./auth');

const client = new Discord.Client();

client.on("ready", () =>
		{
			console.log("ready");
		}
	 );

client.on("message", message =>
		{
			if (message.content.substring(0,1) == '!')
			{
				var firstSpace = message.content.indexOf(' ');
				
				var command = (firstSpace >= 0) ? message.content.substring(1, firstSpace) : message.content.substring(1);

				switch(command)
				{
					case 'ping':
						message.channel.sendMessage("Pong!");
						break;

					default:
						message.channel.sendMessage("You just tried to run the " + command + " command, didn't you?");
				}
			}
		}
	 );

client.login(Auth.key);
