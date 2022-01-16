import Client from '../../../Client';
import { Message } from 'discord.js';

export default function InviteEmbed(client: Client, message: Message, invite: any) {
  const embed = client.embed({
    title: `\`${message.author.username}\` has created an invite!`,
    fields: [{ name: 'Invite Link', value: `https://discord.gg/${invite.code}` }],
    thumbnail: { url: message.author.displayAvatarURL({ format: 'png', dynamic: true }) },
    color: `#a35ecc`,
  }, message);
  return embed;
}
