import { Message } from 'discord.js';
import { Event } from '../Interfaces'; 
import { GetFromDBMessage } from '../Utils/Functions';
import { DBFields } from '../config.json';


export const event: Event = {
    name: 'guildMemberAdd',
    run: async (client, message: Message) => {
        // Your code goes here
        const DBField = DBFields.WelcomeChannelName;
        const WelcomeChannel = await GetFromDBMessage(DBField, message);
        
        if(WelcomeChannel == null) return;


        
    }
}