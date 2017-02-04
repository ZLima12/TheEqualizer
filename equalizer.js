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

					default:
						message.channel.sendMessage("What does \"" + command[0] + "\" mean?");
				}
			}
		}
	 );

client.login(Auth.key);
