import * as FS from "fs";

export default class Documentation
{
	protected description: string;
	get Description(): string
	{ return this.description }

	protected invocation: string;
	get Invocation(): string
	{ return this.invocation }

	protected command: string;
	get Command(): string
	{ return this.command }

	constructor(commandName: string)
	{
		this.command = commandName;
	}

	loadSync()
	{
			this.description = FS.readFileSync("doc/commands/" + this.command +  "/description.md").toString();
			this.invocation = FS.readFileSync("doc/commands/" + this.command + "/invocation.md").toString();
	}
}
