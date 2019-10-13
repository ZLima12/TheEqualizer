import * as FS from "fs"
import * as Path from "path"

export default abstract class FileDirectory
{
	private readonly directory: string;

	/**
	 * The directory that the files are stored in.
	 */
	public get Directory(): string
	{ return this.directory; }

	private filePaths: Set<string>;

	/**
	 * Lists paths of all files in this.Directory. Each path is absolute.
	 */
	public get FilePaths(): Set<string>
	{ return new Set(this.filePaths) }

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
	 * @param directory - The directory containing files. (If relative, relative to file-directory.ts).
	 * @param fileExtensions - Only files with these extensions will be loaded. Must include '.'.
	 */
	public constructor(directory: string, fileExtensions: Set<string>)
	{
		this.directory = (Path.isAbsolute(directory)) ? directory : Path.join(__dirname, directory);
		this.filePaths = new Set();
		this.supportedExtensions = new Set(fileExtensions);
	}

	/**
	 * Refreshes directory listing. (i.e. updates this.FilePaths)
	 */
	public async refreshListing(): Promise<void>
	{
		let entries: Array<FS.Dirent>;

		try
		{
			entries = await FS.promises.readdir(this.Directory, { withFileTypes: true });
		}

		catch (e)
		{
			this.loadError = e;
			throw e;
		}

		const files = entries.filter(entry => entry.isFile());

		const supportedFiles = files.filter(
			file => this.SupportedExtensions.has(Path.parse(file.name).ext));

		const paths = supportedFiles.map(file => Path.join(this.Directory, file.name));

		this.filePaths = new Set(paths);
	}
}
