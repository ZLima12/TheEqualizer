import * as DiscordJS from "discord.js";

class EventHandler
{
	private event: string;
	public get Event(): string
	{ return this.event; }

	private action: (...any) => void;
	public get Action(): (...any) => void
	{ return this.action; }

	constructor(event: string, action: (...any) => void)
	{
		this.event = event;
		this.action = action;
	}
}

namespace EventHandler
{
	export let loadedHandlers: Map<string, EventHandler> = new Map<string, EventHandler>();

	export const SupportedEvents: Array<string> =
	[
		"ready",
		"disconnect",
		"voiceStateUpdate",
		"message"
	];

	async function loadHandler(name: string): Promise<void>
	{
		EventHandler.loadedHandlers.set(name, require("./handlers/" + name));
	}

	export async function loadHandlers(): Promise<void>
	{
		let promises: Array<Promise<void>> = new Array<Promise<void>>();

		for (let event of EventHandler.SupportedEvents)
		{
			promises.push(loadHandler(event));
		}

		for (let promise of promises)
		{
			await promise;
		}
	}

	export function setHandlers(client: DiscordJS.Client): void
	{
		for (let [event, handler] of EventHandler.loadedHandlers)
			client.on(event, handler.Action);
	}
}

export default EventHandler;
