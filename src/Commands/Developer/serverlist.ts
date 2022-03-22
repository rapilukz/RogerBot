import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions';

export const command: Command = {
    name: 'serverlist',
    aliases: [],
    cooldown: 0,
    permissions: [ADMINISTRATOR],
    category: 'Developer',
    developer: true,
    description: 'Get a list of all servers the bot is in',
    run: async (client, message, args) => {   
        
        const servers = client.guilds.cache.map(async guild => {
            const owner = await guild.fetchOwner();
            return {
                name: guild.name,
                id: guild.id,
                owner: owner.user.tag,
                memberCount: guild.memberCount
            }
        });

        const guilds = await Promise.all(servers);
        
        const embed = new MessageEmbed({
            title: 'List of Servers',
            description: `**Nº of Servers:** ${client.guilds.cache.size}`,
            color: 'PURPLE',
            fields: guilds.map(guild => {
                return {
                    name: guild.name,
                    value: `**Owner:** ${guild.owner}\n**Member Count:** ${guild.memberCount}\n**ID:** ${guild.id}`
                }
            }),
            thumbnail: {
                url: client.user.displayAvatarURL({ format: 'png', dynamic: true })
            },
            footer:{
                text: `List of servers as of ${new Date().toLocaleString()}`
            },
        })

        message.reply(`A List of all servers as been sent to you in a DM.📜`)
        message.author.send({ embeds: [embed] });

    }
}


