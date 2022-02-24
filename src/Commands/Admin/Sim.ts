import { ClientEvents } from 'discord.js';
import { Command } from '../../Interfaces';
import Twitch from '../../Utils/Classes/Twitch';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions'; 

export const command: Command = {
    name: 'sim',
    aliases: [],
    cooldown: 0,
    permissions: [ADMINISTRATOR],
    category: 'Admin',
    description: '',
    run: async (client, message, args) => {
       /*  client.emit('guildMemberAdd', message.member);     */
       const TwitchAPI = new Twitch(client);

    
    }
} 