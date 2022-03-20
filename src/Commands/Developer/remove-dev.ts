import { Command } from '../../Interfaces';
import { CheckDev } from '../../Utils/Helpers/MongoFunctions';
import DeveloperSchema from '../../Utils/Schemas/Developer';

export const command: Command = {
  name: 'remove-dev',
  aliases: [],
  cooldown: 0,
  permissions: [],
  developer: true,
  category: 'Developer',
  description: 'Remove a user from the developer list',
  run: async (client, message, args) => {
    const member = message.mentions.members.first();
    if (!member) return message.channel.send('Please mention a user to remove from the developer list.');

    const dev = await CheckDev(member.id);
    if (!dev) return message.channel.send('This user is not a developer.');

    DeveloperSchema.remove({ _id: member.id }, (err) => {
      if (err) return message.channel.send('An error occured.');
    });
    message.channel.send(`\`${member.user.tag}\` has been removed from the developer list.`);
  },
};
