import { Event } from '../Interfaces'; 
import GuildSchema from '../Utils/Schemas/Guild';

export const event: Event = {
    name: 'guildMemberRemove',
    run: async (client, member) => {
        const FarewellData = await GuildSchema.findOne({ _id: member.guild.id });
        if (!FarewellData || !FarewellData.ChannelID || FarewellData == 'None') return;

        return member.guild.channels.cache.get(FarewellData.ChannelID).send({content : `${member} has left the server! 💩`});
    }
}