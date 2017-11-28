import { Client as DJSClient } from "discord.js";
import Globals from "./globals";
import { DiscordPWStatsManager } from "./bot-list-stats";
import { Manager as EventManager } from "./event";

class EqualizerClient extends DJSClient
{
	private pwStatsManager: DiscordPWStatsManager;

	private eventManager: EventManager;

	public constructor()
	{
		super();

		// Bot stats setup
		{
			let pwAuth: string = Globals.Options["discordPwAuth"];

			if (pwAuth)
			{
				this.pwStatsManager = new DiscordPWStatsManager(pwAuth, this);
				this.pwStatsManager.postEvery(5 * 60 * 1000);
				this.on("guildCreate", () => this.pwStatsManager.postStats());
				this.on("guildDelete", () => this.pwStatsManager.postStats());
			}

			else this.pwStatsManager = null;
		}

		this.eventManager = new EventManager("./handlers");

		this.eventManager.loadHandlers().then(() => this.eventManager.setHandlers(this));
	}

	/**
	 * Keeps trying to log in until a successful login.
	 * @param delay - Number of milliseconds to wait between each login attempt.
	 */
	public loginLoop(delay: number = 1000): void
	{
		this.login(Globals.Options["auth"]).catch(() => setTimeout(() => this.loginLoop(delay), delay)); // Must use lambda here to capture this
	}
}

export default EqualizerClient;
