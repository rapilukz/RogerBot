import { Command } from '../../Interfaces';
import { SEND_MESSAGES } from '../../Utils/Permissions';
import { roast } from '../../Utils/Functions';

export const command: Command = {
  name: 'roast',
  aliases: ['roasted'],
  cooldown: 5,
  permissions: [SEND_MESSAGES],
  category: 'Fun',
  description: 'roastes a user or yourself',
  run: async (client, message, args) => {
    if (args[0]) {
      const mentionedMember = message.mentions.users.first();
      if (!mentionedMember) return message.channel.send('Não encontrei esse ser humano');
      roast(mentionedMember, client, message);
      return;
    }
    const user = message.author;
    roast(user, client, message);
  },
};
