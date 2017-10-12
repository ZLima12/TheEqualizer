import EventHandler from "../event-handler";
import Globals from "../globals";

export = new EventHandler
(
	"ready",

	() =>
	{
		console.log("Ready!");
		Globals.ClientInstance.user.setGame(Globals.Options["motd"]);
	}
)
