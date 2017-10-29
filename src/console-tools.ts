import * as DiscordJS from "discord.js"
import Globals from "./globals";

namespace ConsoleTools
{
	export function printJoinURL(): void
	{
		let clientID: string;

		if (Globals.ClientInstance)
		{
			if (Globals.ClientInstance.user)
			{
				if (Globals.ClientInstance.user.id)
				{
					clientID = Globals.ClientInstance.user.id;

					console.log("To add this bot to a server, go to https://discordapp.com/oauth2/authorize?&client_id=" + clientID + "&scope=bot&permissions=0");
				}
			}
		}

		if (!clientID)
		{
			console.log("Couldn't generate the bot's link because we're not connected to Discord yet.")
		}
	}
}

export default ConsoleTools;
