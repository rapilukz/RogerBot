import { Client } from 'discord.js';
import { Event } from '../Interfaces'; 
import ConfigJson from '../config.json';

export const event: Event = {
    name: 'ready',
    run: async (client: Client) => {
        const prefix = ConfigJson.prefix;
        console.log(`${client.user?.username} is online!`);

        //Bot status system
        const arrayOfStatus: string[] = [
        `Arruinando ${client.guilds.cache.size} Servers`,
        `Capitão Roger`,
        `Prefix- ${prefix}`,
        `Roger Socorro`,
        `Não sou Rapper sou o Roger`,
      ];
      const arrayOfTypes: any = ['WATCHING','LISTENING','LISTENING','PLAYING', 'PLAYING'];
      let i = 0
      
      setInterval(() =>{
        if(i === arrayOfStatus.length || i === arrayOfTypes.length) i = 0;
   
        const status = arrayOfStatus[i];
        const statusType = arrayOfTypes[i];
       
        client.user?.setActivity(status, {type: statusType})
        i++;
      }, 10000) // 10 seconds in ms
    }
}