import { Command } from '../../Interfaces';
import { KICK_MEMBERS } from '../../Utils/Helpers/Permissions';
import { GuildMember } from 'discord.js';

export const command: Command = {
  name: 'kick',
  aliases: ['kick'],
  cooldown: 5,
  permissions: [KICK_MEMBERS],
  category: 'Moderation',
  description: 'Kicks a user from the server',
  run: async (client, message, args) => {
    let reason = args.slice(1).join(' ');
    const target = message.mentions.members?.first() as GuildMember;
    if (!target) return message.channel.send('Please mention a user to kick');
    if (!reason) reason = 'No reason provided';
    if (!target.kickable) return message.channel.send('I cannot kick this user');

    const DmEmbed = client.embed(
      {
        title: `\`${target.user.tag}\` has been kicked!`,
        fields: [
          { name: 'Reason', value: `\`${reason}\`` },
          { name: 'Kick By', value: `\`${message.author.tag}\`` },
        ],
        thumbnail: { url: target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
        color: `#FF0000`,
      },
      message
    );

    const ServerEmbed = client.embed(
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

    await target.send({ embeds: [DmEmbed] });
    await target.kick().then(() => {
      message.channel.send({ embeds: [ServerEmbed] });
    });
  },
};
