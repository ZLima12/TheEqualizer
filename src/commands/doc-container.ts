import * as FS from "fs";

export default class Documentation
{
	description: string;
	invocation: string;
	command: string;

	constructor(commandName: string)
	{
		this.description = undefined;
		this.invocation = undefined;
		this.command = commandName;
	}

	loadSync()
	{
			this.description = FS.readFileSync("doc/commands/" + this.command +  "/description.md").toString();
			this.invocation = FS.readFileSync("doc/commands/" + this.command + "/invocation.md").toString();
	}
}