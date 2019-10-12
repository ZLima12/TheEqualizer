import * as FS from "fs";
import * as Path from "path";
import { promisify } from "util"
const readFile = promisify(FS.readFile);

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

	export async function load(commandName: string): Promise<Documentation>
	{
		let description: string;
		let invocation: string;

		const promises = new Array<Promise<string | Buffer>>();

		promises.push(readFile(Path.resolve("./doc/commands/", commandName, "description.md")).then((data: Buffer) => description = data.toString()));
		promises.push(readFile(Path.resolve("./doc/commands/", commandName, "invocation.md")).then((data: Buffer) => invocation = data.toString()));

		await Promise.all(promises);

		return { description: description, invocation: invocation, commandName: commandName }
	}
}

export default Documentation;
