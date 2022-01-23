import { Event } from '../Interfaces'; 
import GuildSchema from '../Utils/Schemas/Guild';

export const event: Event = {
    name: 'guildMemberRemove',
    run: async (client, member) => {
        const data = await GuildSchema.findOne({ _id: member.guild.id });
        if (!data || !data.GoodbyeChannelID) return;

        return member.guild.channels.cache.get(data.GoodbyeChannelID).send({content : `${member} has left the server! 💩`});
    }
}