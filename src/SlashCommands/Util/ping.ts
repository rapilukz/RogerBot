import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import * as Perms from '../../Utils/Permissions'; 

export const command: SlashCommand = {
    category: 'Util',
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot')
    .setDefaultPermission(true),
    run: async (interaction) => {
        interaction.reply('Pong!');
    }
}