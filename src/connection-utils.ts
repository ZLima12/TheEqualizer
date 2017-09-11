import * as DiscordJS from "discord.js";
import Globals from "./globals";

namespace ConnectionUtils
{
	export function loginLoop()
	{
		Globals.ClientInstance.login(Globals.Options["auth"]).catch(() => setTimeout(loginLoop, 500, Globals.ClientInstance));
	}
}

export default ConnectionUtils;
