import EqualizerClient from "./client";
import * as Path from "path";
import { ObjectDirectory } from "./object-directory";

export class Handler
{
	private event: string;

	/**
	 * The event to handle.
	 */
	public get Event(): string
	{ return this.event; }

	private action: (client: EqualizerClient, ...handlerArgs) => void;

	/**
	 * @param event - The event to handle.
	 * @param action - The function to be run when the event is emitted.
	 */
	public constructor(event: string, action: (client: EqualizerClient, ...handlerArgs) => void)
	{
		this.event = event;
		this.action = action;
	}

	/**
	 * Sets the provided {@link EqualizerClient} to use this handler.
	 * @param client - The {@link EqualizerClient} to set.
	 */
	public set(client: EqualizerClient): void
	{
		client.on(this.Event, (...handlerArgs: Array<any>) => this.action(client, ...handlerArgs));
	}
}

export class Manager extends ObjectDirectory<Handler | Array<Handler>>
{
	private readonly handlers: Map<string, Array<Handler>>;
	/**
	 * @param handlersLocation - The directory containing [Handlers]{@link Handler}. (relative to event.ts).
	 */
	public constructor(handlersLocation: string)
	{
		super(Path.join(__dirname, handlersLocation));
		this.handlers = new Map<string, Array<Handler>>();
	}

	/**
	 * Updates this.handlers to reflect objects in this.LoadedObjects.
	 */
	private mapHandlers(): void
	{
		for (const obj of this.LoadedObjects)
		{
			const handlerArr = (obj instanceof Array) ? obj : [obj];

			for (let handler of handlerArr)
			{
				if (!this.handlers.get(handler.Event)) this.handlers.set(handler.Event, new Array<Handler>());

				this.handlers.get(handler.Event).push(handler);
			}
		}
	}

	/**
	 * Load all [Handlers]{@link Handler} from this.Directory.
	 */
	public async loadFromDirectory(): Promise<void>
	{
		return super.loadFromDirectory().then(() => this.mapHandlers());
	}

	/**
	 * Sets all [Handlers]{@link Handler} on the provided {@link EqualizerClient}. (uses EventEmitter#on)
	 * @param client - The {@link EqualizerClient} to set the [Handlers]{@link Handler} on.
	 */
	public setHandlers(client: EqualizerClient): void
	{
		for (const handlerArr of this.handlers.values())
		{
			for (const handler of handlerArr)
			{
				handler.set(client);
			}
		}
	}
}
