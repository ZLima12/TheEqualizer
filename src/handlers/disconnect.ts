import EventHandler from "../event-handler";
import Globals from "../globals";
import ConnectionUtils from "../connection-utils";

export = new EventHandler
(
	"disconnect",

	() =>
	{
		console.log("Bot disconnected, destroying and reconnecting...");
		Globals.ClientInstance.destroy();

		setTimeout
		(
			() => ConnectionUtils.loginLoop(),

			500
		);
	}
)
