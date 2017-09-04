import * as DiscordJS from "discord.js";

namespace Moderation
{
	export namespace DoNotDisturb
	{
		let previousChannel: Map<DiscordJS.Snowflake, DiscordJS.GuildChannel> = new Map<DiscordJS.Snowflake, DiscordJS.GuildChannel>();

		export function shouldBeMoved(user: DiscordJS.GuildMember): boolean
		{
			let dndChannel = DoNotDisturb.getDndChannel(user.guild);

			return (user.voiceChannel !== undefined && user.voiceChannel !== dndChannel && user.selfMute && user.selfDeaf);
		}

		export function shouldBeReturned(user: DiscordJS.GuildMember): boolean
		{
			let dndChannel = DoNotDisturb.getDndChannel(user.guild);

			return (user.voiceChannel === dndChannel && (!user.selfMute || !user.selfDeaf));
		}

		export function getDndChannel(guild: DiscordJS.Guild): DiscordJS.GuildChannel
		{
			for (let pair of guild.channels)
			{
				let channel: DiscordJS.GuildChannel = pair[1];

				if (channel.name === "Do Not Disturb")
				{
					return channel;
				}
			}

			return undefined;
		}

		export function moveUserIfAfk(user: DiscordJS.GuildMember): boolean
		{
			let guild: DiscordJS.Guild = user.guild;
			let dndChannel = DoNotDisturb.getDndChannel(guild);

			if (dndChannel !== undefined)
			{
				if (DoNotDisturb.shouldBeMoved(user))
				{
					if (previousChannel.get(user.id) === undefined)
					{
						previousChannel.set(user.id, user.voiceChannel);
					}

					user.setVoiceChannel(dndChannel);
					return true;
				}
			}

			return false;
		}

		export function verifyPreviousChannelEntry(user: DiscordJS.GuildMember): void
		{
			if (previousChannel.get(user.id) !== undefined)
			{
				let dndChannel = DoNotDisturb.getDndChannel(user.guild);

				if (!user.selfDeaf)
				{
					previousChannel.delete(user.id);
				}
			}
		}

		export function verifyAllPreviousChannelEntries(): void
		{
			for (let entry of previousChannel)
			{
				let userID: DiscordJS.Snowflake = entry[0];
				let channel: DiscordJS.GuildChannel = entry[1];
				let guild: DiscordJS.Guild = channel.guild;

				guild.fetchMember(userID).then((member: DiscordJS.GuildMember) => verifyPreviousChannelEntry(member));
			}
		}

		export function restoreChannelIfReturned(user: DiscordJS.GuildMember): boolean
		{
			let channel = previousChannel.get(user.id);

			if (channel !== undefined)
			{
				if (DoNotDisturb.shouldBeReturned(user))
				{
					user.setVoiceChannel(channel);
					previousChannel.delete(user.id);
					return true;
				}
			}

			return false;
		}

		export function moveAllAfkToDnd(guilds: Array<DiscordJS.Guild>): Array<DiscordJS.GuildMember>
		{
			let movedMembers: Array<DiscordJS.GuildMember> = new Array<DiscordJS.GuildMember>();

			for (let guild of guilds)
			{
				let dndChannel = DoNotDisturb.getDndChannel(guild);

				if (dndChannel !== undefined)
				{
					for (let user of guild.members.values())
					{
						if (DoNotDisturb.shouldBeMoved(user))
						{
							if (previousChannel.get(user.id) === undefined)
							{
								previousChannel.set(user.id, user.voiceChannel);
							}

							user.setVoiceChannel(dndChannel);
							movedMembers.push(user);
						}
					}
				}
			}

			return movedMembers;
		}
	}
}

export default Moderation;
