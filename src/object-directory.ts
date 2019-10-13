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

	private supportedExtensions: Set<string>;

	/**
	 * A Set of supported file extensions. Only files with these extensions will be loaded.
	 */
	public get SupportedExtensions(): Set<string>
	{ return new Set(this.supportedExtensions); }

	protected loadError: Error;

	/**
	 * The first error that occurred on the previous attempt to load objects. (undefined if no errors)
	 */
	public get LoadError(): Error
	{ return this.loadError; }

	/**
	 * @param directory - The directory containing objects. (If relative, relative to object-directory.ts).
	 * @param fileExtensions - Only files with these extensions will be loaded. Must include '.'.
	 */
	public constructor(directory: string, fileExtensions: Set<string> = new Set([".js"]))
	{
		this.directory = (Path.isAbsolute(directory)) ? directory : Path.join(__dirname, directory);
		this.loadedObjects = new Map<string, T>();
		this.supportedExtensions = new Set(fileExtensions);
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
							const extension: string = Path.parse(filePath).ext;

							if (this.supportedExtensions.has(extension))
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
