import { Command } from '../../Interfaces';

export const command: Command = {
  name: 'sim',
  aliases: [],
  cooldown: 0,
  permissions: [],
  category: 'Developer',
  developer: true,
  description: 'Used for testing code',
  run: async (client, message, args) => {
     /* client.emit('guildMemberAdd', message.member);  */   
  
  },
};
