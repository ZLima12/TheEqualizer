import { Handler } from "../event";
import EqualizerClient from "../client";

export = new Handler
(
	"disconnect",

	(client: EqualizerClient) =>
	{
		console.log("Bot disconnected, destroying and reconnecting...");
		client.destroy();

		setTimeout
		(
			() => client.loginLoop(),

			500
		);
	}
);
