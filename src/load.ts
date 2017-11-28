import Globals from "./globals";
import Command from "./command";
import Moderation from "./moderation";
import EqualizerClient from "./client";

async function Load(): Promise<void>
{
	Globals.Options = require("../options");

	Globals.ClientInstance = new EqualizerClient();

	let commandsPromise: Promise<void> = Command.loadCommands();

	Moderation.DoNotDisturb.startCheckTimer(2000);

	await commandsPromise;
}

export default Load;
