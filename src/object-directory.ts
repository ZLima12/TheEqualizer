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

	private readonly loadedObjects: Map<string, T>;

	/**
	 * An Array of all currently loaded objects.
	 */
	protected get LoadedObjects(): Array<T>
	{ return Array.from(this.loadedObjects.values()).slice(); }

	/**
	 * A Map from file path to the respective loaded object.
	 */
	protected get FilenameObjectMap(): Map<string, T>
	{ return new Map(this.loadedObjects) }

	private allowJson: boolean;

	/**
	 * Whether JSON files will be loaded from the directory.
	 */
	public get AllowJson(): boolean
	{ return this.allowJson; }

	protected loadError: Error;

	/**
	 * The first error that occurred on the previous attempt to load objects. (undefined if no errors)
	 */
	public get LoadError(): Error
	{ return this.loadError; }

	/**
	 * @param directory - The directory containing objects. (If relative, relative to object-directory.ts).
	 * @param allowJson - When true, json files will be loaded.
	 */
	public constructor(directory: string, allowJson: boolean = false)
	{
		this.directory = (Path.isAbsolute(directory)) ? directory : Path.join(__dirname, directory);
		this.loadedObjects = new Map<string, T>();
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
						this.loadError = undefined;

						if (err)
						{
							this.loadError = err;
							return reject(err);
						}

						for (let file of files)
						{
							const filePath: string = Path.join(this.Directory, file);
							if (filePath.endsWith(".js") || (this.AllowJson && filePath.endsWith(".json")))
							{
								try
								{
									this.loadedObjects.set(filePath, require(filePath));
								}

								catch (e)
								{
									this.loadError = e;
									return reject(e);
								}
							}
						}

						return resolve();
					}
				);
			}
		);
	}
}
