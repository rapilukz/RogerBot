import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';

export const command: SlashCommand = {
    category: 'Admin',
    data: new SlashCommandBuilder()
        .setName('teste')
        .setDescription('Configure the bot')
        .setDefaultPermission(false),     
    run: (interaction) =>{
        
    }
}
