import { Command } from '../../Interfaces'; 
import { SEND_MESSAGES } from '../../Utils/Permissions' ;
import { GetChannels } from '../../Utils/Functions';


export const command: Command = {
    name: 'ping',
    aliases: [],
    cooldown: 3,
    permissions: [SEND_MESSAGES],
    category: 'Fun',
    description: 'Test command',
    run: async (client, message, args) => {
        message.channel.send('Pong!');
    }
}

