import Client from '../../../Client';
import { Message } from 'discord.js'; 

export default function NoCommand(client: Client, message: Message) {
  const embed = client.embed(
    { title: `I don't know what to do with that command \`${message.author.username}\``,
     fields: [
        { name: `I'll give you a hint ❤`, value: `use \`roger help\` so you can learn something` },
     ],
     color: `RED`, 
    }, message
  );
  return message.reply({ embeds: [embed] });
}