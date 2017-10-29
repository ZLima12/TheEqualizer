import EventHandler from "../event-handler";
import Globals from "../globals";
import ConsoleTools from "../console-tools";

export = new EventHandler
(
	"ready",

	() =>
	{
		console.log("Ready!");
		Globals.ClientInstance.user.setGame(Globals.Options["motd"]);

		ConsoleTools.printJoinURL();
	}
)
