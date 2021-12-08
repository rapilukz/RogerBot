import Client from '../../Client';
import { Message } from 'discord.js'; 

export default function PrefixEmbed(client: Client, message: Message, Prefix) {
    const embed = client.embed({
        title: `Prefix was changed to \`${Prefix}\``,
        fields: [{ name: `Changed by:`, value: `\`${message.author.tag}\``}],
        thumbnail: {
          url: message.author.displayAvatarURL({ format: 'png', dynamic: true }),
        },
        color: 'DARK_GREEN',
      }, message);
    return message.channel.send({ embeds: [embed] });
}