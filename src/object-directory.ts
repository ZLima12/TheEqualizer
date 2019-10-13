import FileDirectory from "./file-directory"

export abstract class ObjectDirectory<T> extends FileDirectory
{
	private readonly loadedObjects: Map<string, T>;

	/**
	 * An Array of all currently loaded objects.
	 */
	protected get LoadedObjects(): Array<T>
	{ return Array.from(this.loadedObjects.values()); }

	/**
	 * A Map from file path to the respective loaded object.
	 */
	protected get FilenameObjectMap(): Map<string, T>
	{ return new Map(this.loadedObjects) }

	/**
	 * @param directory - The directory containing objects. (If relative, relative to object-directory.ts).
	 * @param fileExtensions - Only files with these extensions will be loaded. Must include '.'.
	 */
	public constructor(directory: string, fileExtensions: Set<string> = new Set([".js"]))
	{
		super(directory, fileExtensions);
		this.loadedObjects = new Map<string, T>();
	}

	/**
	 * Loads all objects in this.Directory.
	 */
	public async loadFromDirectory(): Promise<void>
	{
		await this.refreshListing();

		for (const file of this.FilePaths)
		{
			try
			{
				this.loadedObjects.set(file, require(file));
			}

			catch (e)
			{
				this.loadError = e;
				throw e;
			}
		}
	}
}
