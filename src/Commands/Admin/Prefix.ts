import { Command } from '../../Interfaces';
import { ADMINISTRATOR } from '../../Utils/Permissions';
import PrefixSchema from '../../Utils/Schemas/Prefix';
import PrefixEmbed from '../../Utils/Embeds/Prefix';
import mongosse from 'mongoose';

mongosse.set('useFindAndModify', false);
export const command: Command = {
  name: 'prefix',
  aliases: ['setprefix', 'set-prefix'],
  cooldown: 5,
  permissions: [ADMINISTRATOR],
  category: 'Admin',
  description: 'Change the prefix of the bot',
  run: async (client, message, args) => {
    // Your code goes here
    const NewPrefix = args[0];
    if (!NewPrefix) return message.reply('Please provide a new prefix');
    if (NewPrefix.length > 8) return message.reply('Prefix cannot be longer than 8 characters');
    if (NewPrefix <= 1) return message.reply('Prefix cannot be less than 2 characters');

    try {
      const guildId = message.guildId;
      
      await PrefixSchema.findOneAndUpdate({ _id: guildId }, { _id: guildId, prefix: NewPrefix }, { upsert: true });
      PrefixEmbed(client, message, NewPrefix);
    } catch (error) {
      message.channel.send(`An error occured while trying to change the prefix`);
      console.log(error);
    }
  },
};
