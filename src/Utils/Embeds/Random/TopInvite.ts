import Client from '../../../Client';
import { Message } from 'discord.js'; 

export default function Leaderboard(client: Client, message: Message, LeaderboardTemplate: string) {
    const embed = client.embed(
        { title: `💙INVITES LEADERBOARD FOR  \`${message.guild.name}\`💙`,
         description: LeaderboardTemplate, 
         thumbnail: { url: message.guild.iconURL() },
         color: `#0099ff` ,
        }, message
    );
    return embed;
}