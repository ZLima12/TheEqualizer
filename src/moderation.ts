import * as DiscordJS from "discord.js";

namespace Moderation
{
	export namespace DoNotDisturb
	{
		export function shouldBeMoved(user: DiscordJS.GuildMember): boolean
		{
			return (user.voiceChannel !== undefined && user.selfMute && user.selfDeaf);
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
					user.setVoiceChannel(dndChannel);
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
