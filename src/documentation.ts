import * as FS from "fs";
import * as Path from "path";

interface Documentation
{
	readonly description: string;

	readonly invocation: string;

	readonly commandName: string;
}

namespace Documentation
{
	export function loadSync(commandName: string): Documentation
	{
		const description = FS.readFileSync(Path.resolve("./doc/commands/", commandName, "description.md")).toString();
		const invocation = FS.readFileSync(Path.resolve("./doc/commands/", commandName, "invocation.md")).toString();

		return { description: description, invocation: invocation, commandName: commandName };
	}

	function readFilePromise(path: string): Promise<string>
	{
		return new Promise<string>
		(
			(resolve, reject) =>
			{
				FS.readFile
				(
					path,

					(err, data) =>
					{
						if (err) return reject(err);

						else return resolve(data.toString());
					}
				);
			}
		);
	}

	export async function load(commandName: string): Promise<Documentation>
	{
		let description: string;
		let invocation: string;

		const promises = new Array<Promise<string | Buffer>>();

		promises.push(readFilePromise(Path.resolve("./doc/commands/", commandName, "description.md")).then((data: string) => description = data));
		promises.push(readFilePromise(Path.resolve("./doc/commands/", commandName, "invocation.md")).then((data: string) => invocation = data));

		await Promise.all(promises);

		return { description: description, invocation: invocation, commandName: commandName }
	}
}

export default Documentation;
