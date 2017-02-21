import * as DiscordJS from "discord.js";

import Documentation from "./doc-container";

class Command
{
	protected action: (message: DiscordJS.Message) => Command.ExitStatus;
	get Action(): (message: DiscordJS.Message) => Command.ExitStatus
	{ return this.action }

	protected name: string;
	get Name(): string
	{ return this.name }

	protected documentation: Documentation;
	get Documentation(): Documentation
	{ return this.documentation }

	constructor(name: string, action: (message: DiscordJS.Message) => Command.ExitStatus)
	{
		this.action = action;
		this.name = name;
		this.documentation = new Documentation(this.name);
		this.documentation.loadSync();
	}
}

namespace Command
{
	export enum ExitStatus
	{
		Success,
		Failure,
		CommandNotFound,
		BadInvocation,
		BadInvokeNoReply
	}

	export const SupportedCommands: Array<string> =
	[
		"cancel",
		"destroy",
		"mute",
		"ping",
		"source",
		"unmute",
		"vote"
	];

	export function messageToArray(message: DiscordJS.Message): Array<string>
	{
		let command: Array<string> = message.content.split(' ');
		command[0] = command[0].substring(1);
		return command;
	}

	export var loadedCommands: Map<string, Command> = new Map<string, Command>();

	export function loadCommandsSync(): void
	{
		for (let command of Command.SupportedCommands)
			Command.loadedCommands.set(command, require("./commands/" + command));
	}

	export function runCommand(message: DiscordJS.Message): Command.ExitStatus
	{
		let messageArray: Array<string> = Command.messageToArray(message);
		let command: Command = Command.loadedCommands.get(messageArray[0]);

		if (command === undefined)
		{
			message.reply('`' + messageArray[0] + "` is not a valid command.");
			return Command.ExitStatus.CommandNotFound;
		}

		let exitStatus: Command.ExitStatus = command.Action(message);

		switch (exitStatus)
		{
			case Command.ExitStatus.BadInvocation:
				message.reply("From the documentation: \n\n" + command.Documentation.Invocation);
				break;
		}

		return exitStatus;
	}
}

export default Command;