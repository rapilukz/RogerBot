import Client from '../../../Client';
import { Message } from 'discord.js'; 

export default function roast(client: Client, message: Message, user, Insult: string){
    const embed = client.embed(
        { title: `\`${user.tag}\` is about to get roasted!`,
         description: `${Insult}`, 
         thumbnail: { url: user.displayAvatarURL({ format: 'png', dynamic: true }) },
         color: `RANDOM` 
        }, message
    );
    return embed;
}