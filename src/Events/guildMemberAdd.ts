import { Event } from '../Interfaces'; 
import GuildSchema from '../Utils/Schemas/Guild';

export const event: Event = {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        const data = await GuildSchema.findOne({ _id: member.guild.id });
        if (!data || !data.WelcomeChannelID) return;

        if(data.DefaultRoleID){
           const Role = member.guild.roles.cache.get(data.DefaultRoleID);
            if(Role) member.roles.add(Role);
        }

        return member.guild.channels.cache.get(data.WelcomeChannelID).send({content: `${member} has joined the server!`});
    }
}