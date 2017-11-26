import Globals from "./globals";
import Command from "./command";
import EventHandler from "./event-handler";
import Moderation from "./moderation";
import EqualizerClient from "./client";

async function Load(): Promise<void>
{
	Globals.Options = require("../options");

	Globals.ClientInstance = new EqualizerClient();

	let commandsPromise: Promise<void> = Command.loadCommands();

	let handlersPromise: Promise<void> = EventHandler.loadHandlers().then
	(() => EventHandler.setHandlers(Globals.ClientInstance));

	Moderation.DoNotDisturb.startCheckTimer(2000);

	await commandsPromise;
	await handlersPromise;
}

export default Load;
