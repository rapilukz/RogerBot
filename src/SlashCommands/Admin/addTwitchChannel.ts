import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions';
import { CommandInteraction } from 'discord.js';

export const command: SlashCommand = {
  category: 'Admin',
  userPermissions: [ADMINISTRATOR],
  data: new SlashCommandBuilder()
    .setName('add-twitch-channel')
    .setDescription('Add a Twitch channel to get notifications from'),
  run: async (interaction: CommandInteraction) => {
    // Your code goes here
    console.log('addTwitchChannel');
  },
};
