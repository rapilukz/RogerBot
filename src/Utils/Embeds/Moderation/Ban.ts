import Client from '../../../Client';
import { GuildMember, Message } from 'discord.js';

export function BanServerEmbed(client: Client, message: Message, reason: string, BannedUser: GuildMember) {
  const embed = client.embed(
    {
      title: `\`${BannedUser.user.tag}\` has been banned!`,
      fields: [
        { name: 'Reason', value: `\`${reason}\`` },
        { name: 'Banned By', value: `\`${message.author.tag}\`` },
      ],
      thumbnail: { url: BannedUser.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
      color: `#FF0000`,
    },
    message
  );

  return embed;
}

export function SendBanEmbedDM(client: Client, message: Message, reason: string) {
  const embed = client.embed(
    {
      title: `You have been banned from \`${message.guild.name}\`!`,
      fields: [
        { name: 'Reason', value: `\`${reason}\`` },
        { name: 'Banned By', value: `\`${message.author.tag}\`` },
      ],
      thumbnail: { url: message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
      color: `#FF0000`,
    },
    message
  );
  return embed;
}
