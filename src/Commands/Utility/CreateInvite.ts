import { TextChannel } from 'discord.js';
import { Command } from '../../Interfaces';
import InviteEmbed from '../../Utils/Embeds/Invite';
import { CREATE_INSTANT_INVITE, SEND_MESSAGES, EMBED_LINKS } from '../../Utils/Permissions';

export const command: Command = {
  name: 'invite',
  aliases: ['inv'],
  cooldown: 60,
  permissions: [CREATE_INSTANT_INVITE, SEND_MESSAGES, EMBED_LINKS],
  category: 'Utility',
  description: 'Creates an invite link for the server.',
  run: async (client, message, args) => {
    // Your code goes here
    if (!message.channel.isText()) return;
    const channel = message.channel as TextChannel;
    channel
      .createInvite({
        unique: true,
        reason: 'Invite requested by ' + message.author.tag,
        maxAge: 3600, // 1  hour
      })
      .then((invite) => {
        message.channel.send({ embeds: [InviteEmbed(client, message, invite)] });
      })
      .catch((err) => {
        message.channel.send('I was unable to create an invite for this channel.');
      });
  },
};
