import { Command } from '../../Interfaces';
import { CheckDev } from '../../Utils/Helpers/MongoFunctions';
import DeveloperSchema from '../../Utils/Schemas/Developer';

export const command: Command = {
    name: 'add-dev',
    aliases: [],
    cooldown: 0,
    permissions: [],
    category: 'Developer',
    developer: true,
    description: 'Add a user to the developer list',
    run: async (client, message, args) => {
        const member = message.mentions.members.first();
        if (!member) return message.channel.send('Please mention a user to add to the developer list.');

        const dev = await CheckDev(member.id);
        if (dev) return message.channel.send('This user is already a developer.');

        DeveloperSchema.create({ _id: member.id, Username: member.user.tag });
        message.channel.send(`\`${member.user.tag}\` has been added to the developer list.`);
    }
}