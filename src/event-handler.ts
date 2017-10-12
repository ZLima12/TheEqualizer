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

	export function loadHandlersSync(): void
	{
		for (let event of EventHandler.SupportedEvents)
			EventHandler.loadedHandlers.set(event, require("./handlers/" + event));
	}

	export function setHandlersSync(client: DiscordJS.Client): void
	{
		for (let [event, handler] of EventHandler.loadedHandlers)
			client.on(event, handler.Action);
	}
}

export default EventHandler;
