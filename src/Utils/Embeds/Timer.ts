import ms from 'ms';
import Client from '../../Client';
import { Message } from 'discord.js';

export function Timer(client: Client, message: Message, time: ms, reason: string) {
  const embed = client.embed({
    title: ``,
    author: {
      name: `${message.author.tag} Needs and alarm`,
      icon_url: `${message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })}`,
    },
    description: `Time: \`${time}\`\nReason: \`${reason}\``,
    color: `#4bede2`,
  }, message);
  return embed;
}

export function EndTimer(client: Client, message: Message, time: ms, reason: string) {
  const embed = client.embed({
    title: ``,
    author: {
      name: `${message.author.tag} Your alarm has ended`,
      icon_url: `${message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })}`,
    },
    description: `Time: \`${time}\`\nReason: \`${reason}\`\nYour alarm at \`${message.guild.name}\` finished.`,
    thumbnail: {
      url: `${message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 })}`,
    },
    color: `#4bede2`,
  }, message);
  return message.author.send({ embeds: [embed] });
}
