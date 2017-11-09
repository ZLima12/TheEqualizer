import { Client as DJSClient } from "discord.js";
import Globals from "./globals";

class EqualizerClient extends DJSClient
{
	/**
	 * Keeps trying to log in until a successful login.
	 * @param delay - Number of milliseconds to wait between each login attempt.
	 */
	loginLoop(delay: number = 1000): void
	{
		this.login(Globals.Options["auth"]).catch(() => setTimeout(() => this.loginLoop(delay), delay)); // Must use lambda here to capture this
	}
}

export default EqualizerClient;
