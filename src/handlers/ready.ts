import { Handler } from "../event";
import Globals from "../globals";
import EqualizerClient from "../client";
import ConsoleTools from "../console-tools";

export = new Handler
(
	"ready",

	(client: EqualizerClient) =>
	{
		console.log("Ready!");
		client.user.setGame(Globals.Options["motd"]);

		ConsoleTools.printJoinURL();
	}
)
