import Globals from "./globals";
import Command from "./command";
import EventHandler from "./event-handler";
import Moderation from "./moderation";

function Load(): void
{
	Globals.Options = require("../options");

	Command.loadCommandsSync();

	EventHandler.loadHandlersSync();
	EventHandler.setHandlersSync(Globals.ClientInstance);

	Moderation.DoNotDisturb.startCheckTimer(2000);
}

export default Load;
