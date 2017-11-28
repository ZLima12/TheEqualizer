import EqualizerClient from "./client";
import * as Path from "path";
import * as FS from "fs";

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
	constructor(event: string, action: (client: EqualizerClient, ...handlerArgs) => void)
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

export class Manager
{
	private readonly loadedHandlers: Map<string, Handler>;

	private readonly handlersLocation: string;

	/**
	 * The directory containing the [Handlers]{@link Handler}. (absolute path)
	 */
	public get HandlersLocation(): string
	{ return this.handlersLocation; }

	/**
	 * @param handlersLocation - The directory containing [Handlers]{@link Handler}. (relative to event.ts).
	 */
	public constructor(handlersLocation: string)
	{
		this.loadedHandlers = new Map<string, Handler>();
		this.handlersLocation = Path.resolve(Path.join(__dirname, handlersLocation));
	}

	/**
	 * Loads a {@link Handler} from HandlersLocation.
	 * @param path - The path of the {@link Handler}.
	 */
	private async loadHandler(path: string): Promise<void>
	{
		this.loadedHandlers.set(path, require(path));
	}

	/**
	 * Loads all [Handlers]{@link Handler} in HandlersLocation.
	 */
	public async loadHandlers(): Promise<void>
	{
		return new Promise<void>
		(
			(resolve, reject) =>
			{
				FS.readdir
				(
					this.HandlersLocation,
					{ },
					async (err: NodeJS.ErrnoException, files: Array<string>) =>
					{
						if (err) reject(err);

						let promises: Array<Promise<void>> = new Array<Promise<void>>();

						for (let file of files)
						{
							const filePath: string = Path.join(this.HandlersLocation, file);
							promises.push(this.loadHandler(filePath));
						}

						for (let promise of promises)
						{
							await promise;
						}

						resolve();
					}
				);
			}
		);
	}

	/**
	 * Sets all [Handlers]{@link Handler} on the provided {@link EqualizerClient}. (uses EventEmitter#on)
	 * @param client - The {@link EqualizerClient} to set the [Handlers]{@link Handler} on.
	 */
	public setHandlers(client: EqualizerClient): void
	{
		for (const handler of this.loadedHandlers.values())
		{
			handler.set(client);
		}
	}
}
