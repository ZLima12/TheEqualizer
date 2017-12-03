import * as Path from "path";
import * as FS from "fs";

export abstract class ObjectDirectory<T>
{
	private readonly directory: string;

	/**
	 * The directory that the objects are stored in.
	 */
	public get Directory(): string
	{ return this.directory; }

	private readonly loadedObjects: Array<T>;

	/**
	 * An {@link Array} of all currently loaded objects.
	 */
	protected get LoadedObjects(): Array<T>
	{ return this.loadedObjects.slice(); }

	private allowJson: boolean;

	/**
	 * Whether JSON files will be loaded from the directory.
	 */
	protected get AllowJson(): boolean
	{ return this.allowJson; }

	/**
	 * @param directory - The directory containing objects. (If relative, relative to object-directory.ts).
	 * @param allowJson - When true, json files will be loaded.
	 */
	public constructor(directory: string, allowJson: boolean = false)
	{
		this.directory = (Path.isAbsolute(directory)) ? directory : Path.join(__dirname, directory);
		this.loadedObjects = new Array<T>();
		this.allowJson = allowJson;
	}

	/**
	 * Loads all objects in this.Directory.
	 */
	public async loadFromDirectory(): Promise<void>
	{
		return new Promise<void>
		(
			(resolve, reject) =>
			{
				FS.readdir
				(
					this.Directory,
					{ },
					async (err: NodeJS.ErrnoException, files: Array<string>) =>
					{
						if (err) reject(err);

						for (let file of files)
						{
							const filePath: string = Path.join(this.Directory, file);
							if (filePath.endsWith(".js") || (this.AllowJson && filePath.endsWith(".json")))
								this.loadedObjects.push(require(filePath));
						}

						resolve();
					}
				);
			}
		);
	}
}
