import { Handler } from "../event";
import EqualizerClient from "../client";
import { Invocation } from "../command";

export = new Handler
(
	"commandInvoked",

	(client: EqualizerClient, invocation: Invocation) =>
	{
		invocation.run();
	}
)
