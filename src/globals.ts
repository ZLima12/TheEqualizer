import * as DiscordJS from "discord.js";

namespace Globals
{
	export var client: DiscordJS.Client = undefined;
	export var options = undefined;
	export var motd = "=help";
}

export default Globals;