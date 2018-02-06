import { Client as DJSClient } from "discord.js";
import Globals from "./globals";
import { DiscordPWStatsManager } from "./bot-list-stats";
import { Manager as EventManager } from "./event";
import { Manager as CommandManager } from "./command";
import Moderation from "./moderation";

class EqualizerClient extends DJSClient
{
	public readonly pwStatsManager: DiscordPWStatsManager;

	public readonly eventManager: EventManager;

	public readonly commandManager: CommandManager;

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

		this.commandManager = new CommandManager("./commands");
		this.eventManager = new EventManager("./handlers");
	}

	/**
	 * Keeps trying to log in until a successful login.
	 * @param delay - Number of milliseconds to wait between each login attempt.
	 */
	public loginLoop(delay: number = 1000): void
	{
		this.login(Globals.Options["auth"]).catch(() => setTimeout(() => this.loginLoop(delay), delay)); // Must use lambda here to capture this
	}

	public async load(): Promise<void>
	{
		const promises: Array<Promise<void>> = new Array<Promise<void>>();

		promises.push(this.commandManager.loadFromDirectory());
		promises.push(this.eventManager.loadFromDirectory().then(() => this.eventManager.setHandlers(this)));

		Moderation.DoNotDisturb.startCheckTimer(this, 2000);

		for (const promise of promises)
		{
			await promise;
		}
	}
}

export default EqualizerClient;
