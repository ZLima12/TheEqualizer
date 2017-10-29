import Globals from "./globals";
import Command from "./command";
import EventHandler from "./event-handler";
import Moderation from "./moderation";

async function Load(): Promise<void>
{
	let commandsPromise: Promise<void> = Command.loadCommands();

	let handlersPromise: Promise<void> = EventHandler.loadHandlers().then
	(() => EventHandler.setHandlers(Globals.ClientInstance));

	Globals.Options = require("../options");

	Moderation.DoNotDisturb.startCheckTimer(2000);

	await commandsPromise;
	await handlersPromise;
}

export default Load;
