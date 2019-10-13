import LoadableFileDirectory from "./loadable-file-directory"
import * as Path from "path"

export default class ObjectDirectory<T> extends LoadableFileDirectory<T>
{
	/**
	 * @param directory - The directory containing objects. (If relative, relative to object-directory.ts).
	 * @param fileExtensions - Only files with these extensions will be loaded. Must include '.'.
	 */
	public constructor(directory: string, fileExtensions: Set<string> = new Set([".js"]))
	{
		super(directory, fileExtensions);
	}

	public async loadEntry(file: string): Promise<T>
	{
		await this.refreshListing();

		const path = (Path.isAbsolute(file)) ? file : Path.join(__dirname, file);
		const parsed: Path.ParsedPath = Path.parse(path);

		if (parsed.dir !== this.Directory)
		{
			const e = new RangeError(`File '${ path }' is not in directory '${ this.Directory }'!`);
			this.loadError = e;
			throw e;
		}

		let obj: T;
		try
		{
			obj = require(path);
		}

		catch (e)
		{
			this.loadError = e;
			throw e;
		}

		this.loadedEntryMap.set(path, obj);
		return obj;
	}
}
