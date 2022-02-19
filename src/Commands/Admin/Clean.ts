import { Command } from '../../Interfaces';
import { ADMINISTRATOR } from '../../Utils/Permissions';
import { isNumber } from '../../Utils/Helpers/Functions';
import { TextChannel } from 'discord.js';


export const command: Command = {
  name: 'clean',
  aliases: ['purge', 'prune', 'delete', 'clear', 'c', 'cleanup'],
  cooldown: 0,
  permissions: [ADMINISTRATOR],
  category: 'Admin',
  description: 'cleans the number of messages specified',
  run: async (client, message, args) => {
    if (!args[0]) return message.reply('Please specify the number of messages to delete.');

    if (!isNumber(args[0])) return message.reply('Please enter a valid number of messages.');
    if (args[0] > 100) return message.reply(`I can't erase more than 100 messages at once.`);
    if (args[0] < 1) return message.reply('Please enter a number greater than 0.');

    if (!message.channel.isText()) return;
    
    const Channel = message.channel as TextChannel;
    await Channel.bulkDelete(args[0]).catch(() => {
      return message.channel.send("I can't delete messages that are older than 14 days.");
    });
  },
};
