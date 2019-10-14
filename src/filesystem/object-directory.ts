import LoadableFileDirectory from "./loadable-file-directory"

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

		const path = this.resolve(file);
		const e = this.fileLocationError(path);
		if (e)
		{
			this.loadErrorMap.set(path, e)
			throw e;
		}

		let obj: T;
		try
		{
			obj = require(path);
		}

		catch (e)
		{
			this.loadErrorMap.set(path, e);
			throw e;
		}

		this.loadedEntryMap.set(path, obj);
		return obj;
	}
}
