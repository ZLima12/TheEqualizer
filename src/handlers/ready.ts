import { Handler } from "../event";
import Globals from "../globals";
import EqualizerClient from "../client";

export = new Handler
(
	"ready",

	(client: EqualizerClient) =>
	{
		console.log("Ready!");
		client.user.setActivity(Globals.Options["motd"]);

		client.generateInvite(8).then((link) => console.log("To add this bot to a server, go to " + link));
	}
)
