import * as DiscordJS from "discord.js";

import Documentation from "./doc-container";

class Command
{
	action: (message: DiscordJS.Message) => Command.ExitStatus;
	name: string;
	documentation: Documentation;

	constructor(name: string, action: (message: DiscordJS.Message) => Command.ExitStatus)
	{
		this.action = action;
		this.name = name;
		this.documentation = new Documentation(this.name);
		this.documentation.loadSync();
	}

	static SupportedCommands: Array<string> =
	[
		"cancel",
		"destroy",
		"mute",
		"ping",
		"source",
		"unmute",
		"vote"
	];

	static messageToArray(message: DiscordJS.Message): Array<string>
	{
		let command: Array<string> = message.content.split(' ');
		command[0] = command[0].substring(1);
		return command;
	}

	static loadedCommands: Map<string, Command> = new Map<string, Command>();

	static loadCommandsSync(): void
	{
		for (let command of Command.SupportedCommands)
			Command.loadedCommands.set(command, require("./" + command));
	}

	static runCommand(message: DiscordJS.Message): Command.ExitStatus
	{
		let messageArray: Array<string> = Command.messageToArray(message);
		let command: Command = Command.loadedCommands.get(messageArray[0]);

		if (command === undefined)
		{
			message.reply('`' + messageArray[0] + "` is not a valid command.");
			return Command.ExitStatus.CommandNotFound;
		}

		let exitStatus: Command.ExitStatus = command.action(message);

		switch (exitStatus)
		{
			case Command.ExitStatus.BadInvocation:
				message.reply(command.documentation.invocation);
				break;
		}

		return exitStatus;
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
}

export default Command;