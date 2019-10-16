import * as DiscordJS from "discord.js";
import Documentation from "./documentation";
import { ObjectDirectory } from "@zlima12/file-directories";
import * as Path from "path";
import EqualizerClient from "./client";

export interface Identity
{
	name: string
	aliases?: Array<string>
}

export class Command
{
	private action: (invocation: Invocation) => void;
	public get Action(): (invocation: Invocation) => void
	{ return this.action }

	private name: string;
	public get Name(): string
	{ return this.name }

	private aliases: Array<string>
	public get Aliases(): Array<string>
	{ return Object.assign([], this.aliases); }

	private documentation: Documentation;
	public get Documentation(): Documentation
	{ return this.documentation }

	public constructor(identity: string | Identity, action: (invocation: Invocation) => void)
	{
		if (typeof identity === "string")
		{
			this.name = identity;
			this.aliases = [];
		}

		else
		{
			this.name = identity.name;
			this.aliases = identity.aliases || [];
		}

		this.action = action;
		this.documentation = Documentation.loadSync(this.name);
	}
}

export class Manager extends ObjectDirectory<Command>
{
	private readonly loadedCommands: Map<string, Command>;

	public get SupportedCommands(): Array<string>
	{ return Array.from(this.loadedCommands.keys()); }

	public get Commands(): Map<string, Command>
	{ return this.loadedCommands; }

	/**
	 * Returns a formatted string of all loaded commands, separated by newlines.
	 */
	public get CommandsList(): string
	{
		let list: string = "";

		for (let i = 0; i < this.SupportedCommands.length; i++)
		{
			list += this.SupportedCommands[i];

			if (i < this.SupportedCommands.length - 1)
			{
				list += '\n';
			}
		}

		return list;
	}

	/**
	 * @param commandsLocation - directory containing commands (relative to command.ts).
	 */
	public constructor(commandsLocation: string = "./commands")
	{
		super(Path.join(__dirname, commandsLocation))
		this.loadedCommands = new Map<string, Command>();
	}

	public nameIsAlias(commandName: string): boolean
	{
		const command = this.Commands.get(commandName);
		return command.Name !== commandName;
	}

	public async loadFromDirectory(): Promise<void>
	{
		await super.loadAllEntries();

		this.loadedCommands.clear();

		for (const [path, command] of this.LoadedEntryMap.entries())
		{
			const allNames = [command.Name, ...command.Aliases];
			for (const name of allNames)
			{
				if (this.loadedCommands.get(name))
				{
					this.loadedCommands.clear();

					const e = new Error("Multiple commands with the same name or alias (" + command.Name + ") were loaded.");
					this.loadErrorMap.set(path, e);
					throw e;
				}
			}

			for (const name of allNames)
			{
				this.loadedCommands.set(name, command);
			}
		}
	}

	public async runCommand(invocation: Invocation): Promise<void>
	{
		return invocation.Command.Action(invocation);
	}
}

export class Invocation
{
	private command: Command;
	public get Command(): Command
	{ return this.command; }

	private message: DiscordJS.Message;
	public get Message(): DiscordJS.Message
	{ return this.message; }

	public get Client(): EqualizerClient
	{ return (this.Message.client as EqualizerClient); }	// Okay because we never use a plain DiscordJS.Client.

	public get Member(): DiscordJS.GuildMember
	{ return this.Message.member; }

	public get User(): DiscordJS.User
	{ return this.Message.author; }

	public get Channel(): DiscordJS.TextChannel
	{ return (this.Message.channel as DiscordJS.TextChannel); }		// Okay because we checked to make sure this.Guild !== undefined. (can't be DMs)

	public get Guild(): DiscordJS.Guild
	{ return this.Message.guild; }

	public get Words(): Array<string>
	{ return parseMessage(this.Message).words }

	public get Parameters(): Array<string>
	{ return parseMessage(this.Message).parameters; }

	private constructor(message: DiscordJS.Message, command: Command)
	{
		this.message = message;
		this.command = command;
	}

	public async run(): Promise<void>
	{
		return this.Command.Action(this);
	}

	public static fromMessage(message: DiscordJS.Message): Invocation
	{
		const client: EqualizerClient = (message.client as EqualizerClient);
		const parsedMessage = parseMessage(message);
		const words = parsedMessage.words;

		if (!message.guild || words.length === 0) return undefined;

		const manager = client.commandManager;

		const command: Command = manager.Commands.get(parsedMessage.commandName);

		if (command) return new Invocation(message, command);

		else return undefined;
	}
}

export function splitByWord(message: DiscordJS.Message | string): Array<string>
{
	const sentence = (message instanceof DiscordJS.Message) ? message.content : message;

	let words: Array<string> = new Array<string>();

	for (let line of sentence.split('\n'))
	{
		if (line.trim().length > 0)
		{
			for (let word of line.split(' '))
			{
				if (word.length > 0) words.push(word);
			}
		}
	}

	return words;
}

export interface ParsedMessage
{
	commandName?: string;
	words: Array<string>;
	parameters?: Array<string>;
	invokedViaTag?: boolean;
}

export function parseMessage(message: DiscordJS.Message): ParsedMessage
{
	const words = splitByWord(message);
	const parsed: ParsedMessage = { words: words };

	if (message.content.length > 0)
	{
		if (words[0].startsWith('='))
		{
			parsed.invokedViaTag = false;

			parsed.commandName = words[0].slice(1);

			parsed.parameters = words.slice(1);

			words[0] = words[0].slice(1);
		}

		else if (message.guild && words[0].startsWith(message.guild.me.toString()))
		{
			parsed.invokedViaTag = true;

			const startMinusTag = words[0].slice(message.guild.me.toString().length);

			if (startMinusTag.length > 0)
			{
				parsed.commandName = startMinusTag;
				parsed.parameters = words.slice(1);
				parsed.words[0] = startMinusTag;
			}

			else
			{
				parsed.commandName = words[1];
				parsed.parameters = words.slice(2);
				parsed.words = words.slice(1);
			}
		}
	}

	return parsed;
}
