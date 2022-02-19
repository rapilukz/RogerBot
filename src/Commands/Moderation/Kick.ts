import { Command } from '../../Interfaces';
import { KICK_MEMBERS } from '../../Utils/Helpers/Permissions';
import { GuildMember } from 'discord.js';
import { KickServerEmbed, SendKickEmbedDM } from '../../Utils/Embeds/Moderation/Kick';

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


    await target.send({ embeds: [SendKickEmbedDM(client, message, reason)] });
    await target
      .ban({
        days: 7,
        reason: reason,
      })
      .then(() => {
        message.channel.send({ embeds: [KickServerEmbed(client, message, reason, target)] });
      });
  },
};
