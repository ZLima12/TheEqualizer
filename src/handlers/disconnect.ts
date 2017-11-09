import EventHandler from "../event-handler";
import Globals from "../globals";

export = new EventHandler
(
	"disconnect",

	() =>
	{
		console.log("Bot disconnected, destroying and reconnecting...");
		Globals.ClientInstance.destroy();

		setTimeout
		(
			() => Globals.ClientInstance.loginLoop(),

			500
		);
	}
)
