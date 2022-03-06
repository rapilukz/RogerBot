import { Client } from 'discord.js';
import { Event } from '../Interfaces';
import ConfigJson from '../config.json';
import Twitch from '../Utils/Classes/Twitch';
import { EnableTwitch } from '../config.json';

export const event: Event = {
  name: 'ready',
  run: async (client: Client) => {
    const prefix = ConfigJson.prefix;
    console.log(`${client.user?.username} is online!`);

    //Bot status system
    const arrayOfStatus: string[] = [
      `Ruining ${client.guilds.cache.size} Servers`,
      `Captain Roger`,
      `Prefix- ${prefix}`,
      `Roger Help`,
      `Im not a bot im Roger`,
    ];
    const arrayOfTypes: any = ['WATCHING', 'LISTENING', 'LISTENING', 'PLAYING', 'PLAYING'];
    let i = 0;

    setInterval(() => {
      if (i === arrayOfStatus.length || i === arrayOfTypes.length) i = 0;

      const status = arrayOfStatus[i];
      const statusType = arrayOfTypes[i];

      client.user?.setActivity(status, { type: statusType });
      i++;
    }, 10000); // 10 seconds in ms

    //Check if twitch is enabled in the config.json so other developers can decide not to use the twitch integration
    if (EnableTwitch) {
      const TwitchAPI = new Twitch(client);

      setInterval(async () => {
        client.guilds.cache.forEach(async (guild) => {
          TwitchAPI.SendNotifications(guild);
        });
      }, TwitchAPI.Delay); // 60 seconds in ms
    }
  },
};
