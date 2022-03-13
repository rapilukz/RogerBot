import { Command } from '../../Interfaces';
import { BAN_MEMBERS } from '../../Utils/Helpers/Permissions';
import { GuildMember } from 'discord.js';

export const command: Command = {
  name: 'ban',
  aliases: ['b'],
  cooldown: 0,
  permissions: [BAN_MEMBERS],
  category: 'Moderation',
  description: 'Bans a user from the server',
  run: async (client, message, args) => {
    let reason = args.slice(1).join(' ');
    const target = message.mentions.members?.first() as GuildMember;
    if (!target) return message.channel.send('Please mention a user to ban');
    if (!reason) reason = 'No reason provided';
    if (!target.bannable) return message.channel.send('I cannot ban this user');

    const DMEmbed = client.embed(
      {
        title: `\`${target.user.tag}\` has been banned!`,
        fields: [
          { name: 'Reason', value: `\`${reason}\`` },
          { name: 'Banned By', value: `\`${message.author.tag}\`` },
        ],
        thumbnail: { url: target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
        color: `#FF0000`,
      },
      message
    );

    await target.send({ embeds: [DMEmbed] }).catch((error) => {});

    const ServerEmbed = client.embed(
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
    await target
      .ban({
        reason: reason,
      })
      .then(() => {
        message.channel.send({ embeds: [ServerEmbed] });
      });
  },
};
