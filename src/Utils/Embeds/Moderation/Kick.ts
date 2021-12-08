import Client from '../../../Client';
import { GuildMember, Message } from 'discord.js';

export function KickServerEmbed(client: Client, message: Message, reason: string, KickUser: GuildMember) {
  const embed = client.embed(
    {
      title: `\`${KickUser.user.tag}\` has been kicked!`,
      fields: [
        { name: 'Reason', value: `\`${reason}\`` },
        { name: 'Kick By', value: `\`${message.author.tag}\`` },
      ],
      thumbnail: { url: KickUser.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
      color: `#FF0000`,
    },
    message
  );

  return embed;
}

export function SendKickEmbedDM(client: Client, message: Message, reason: string) {
  const embed = client.embed(
    {
      title: `You have been kicked from \`${message.guild.name}\`!`,
      fields: [
        { name: 'Reason', value: `\`${reason}\`` },
        { name: 'Kicked By', value: `\`${message.author.tag}\`` },
      ],
      thumbnail: { url: message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
      color: `#FF0000`,
    },
    message
  );
  return embed;
}
