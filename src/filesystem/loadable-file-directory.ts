import FileDirectory from "./file-directory";

export default abstract class LoadableFileDirectory<T> extends FileDirectory
{
	protected readonly loadedEntryMap: Map<string, T>;

	/**
	 * A {Map} from file path to file contents.
	 */
	public get LoadedEntryMap(): Map<string, T>
	{ return new Map(this.loadedEntryMap) }

	/**
	 * An {Array} of the contents of each loaded file.
	 */
	public get LoadedEntries(): Array<T>
	{ return Array.from(this.LoadedEntryMap.values()) }

	/**
	 * @param directory - The directory containing files. (If relative, relative to loadable-file-directory.ts).
	 * @param fileExtensions - Only files with these extensions will be loaded. Must include '.'.
	 */
	public constructor(directory: string, fileExtensions: Set<string>)
	{
		super(directory, fileExtensions);
		this.loadedEntryMap = new Map();
	}

	/**
	 * Loads a file from disk. This file is cached in this.LoadedEntryMap.
	 * @param file - The file to load. If relative, relative to this.Directory. Otherwise must be in this.Directory.
	 * @returns {T}, which is the loaded file.
	 * @throws {RangeError} if either the file can not be loaded or is not in this.Directory.
	 */
	public abstract async loadEntry(file: string): Promise<T>;

	/**
	 * Loads all files in this.Directory.
	 */
	public async loadAllEntries(): Promise<void>
	{
		await this.refreshListing();

		const promises = new Array<Promise<T>>();
		for (const file of this.FilePaths)
		{
			promises.push(this.loadEntry(file));
		}

		return Promise.all(promises).then(() => { }); // Make type Promise<void>
	}
}
