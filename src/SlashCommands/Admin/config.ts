import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions';
import { CommandInteraction } from 'discord.js';
import BaseConfigHandler from '../../Utils/Classes/BaseConfigHandler';

export const command: SlashCommand = {
  category: 'Admin',
  userPermissions: [ADMINISTRATOR],
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure the bot')
    .addStringOption((option) =>
      option
        .setName('options')
        .setRequired(true)
        .addChoices([
          ['👋 Welcome Channel ', 'Welcome'],
          ['😠 Farewell Channel', 'Farewell'],
          ['✍️ Announcement Type ', 'Announcement'],
          ['📜 Default Role ', 'Role'],
        ])
        .setDescription('Select an option')
    ),
  run: async (interaction: CommandInteraction) => {
    if (interaction.isAutocomplete) {
      const configHandler = new BaseConfigHandler(interaction);

      interaction.options.data.forEach((option) => {
        configHandler.ExecuteHandlers(option.value);
      });
    }
  },
};
