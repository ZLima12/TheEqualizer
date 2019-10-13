import * as Path from "path";
import { promises as FS } from "fs";

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
	{ return Array.from(this.loadedObjects.values()); }

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
	 * Loads specified files from this.Directory.
	 * @param files - as {Set} of files to load. Each file must be an absolute path and in this.Directory.
	 * @throws {RangeError} if a file path is either not absolute or not in this.Directory.
	 */
	private async loadFiles(files: Set<string>): Promise<void>
	{
		for (const file of files)
		{
			if (!Path.isAbsolute(file))
			{
				const e = new RangeError(`File ${ file } is not an absolute path.`);
				this.loadError = e;
				throw e;
			}

			const parsed: Path.ParsedPath = Path.parse(file);

			if (parsed.dir !== this.Directory)
			{
				const e = new RangeError(`File '${ file }' is not in directory ${ this.Directory }.`);
				this.loadError = e;
				throw e;
			}

			else if (this.supportedExtensions.has(parsed.ext))
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

	/**
	 * Loads all objects in this.Directory.
	 */
	public async loadFromDirectory(): Promise<void>
	{
		return FS.readdir(this.Directory).then
		(
			(files: Array<string>) =>
			{
				const paths = files.map(file => Path.join(this.Directory, file));

				this.loadFiles(new Set(paths))
			}
		).catch(
			(e) =>
			{
				this.loadError = e;
				throw e;
			}
		);
	}
}
