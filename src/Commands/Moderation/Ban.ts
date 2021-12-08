import { Command } from '../../Interfaces';
import { BAN_MEMBERS } from '../../Utils/Permissions';
import { GuildMember } from 'discord.js';
import { BanServerEmbed, SendBanEmbedDM } from '../../Utils/Embeds/Moderation/Ban';

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


    await target.send({ embeds: [SendBanEmbedDM(client, message, reason)] });
    await target
      .ban({
        days: 7,
        reason: reason,
      })
      .then(() => {
        message.channel.send({ embeds: [BanServerEmbed(client, message, reason, target)] });
      });
  },
};
