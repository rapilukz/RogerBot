import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions';
import { CommandInteraction } from 'discord.js';
import BaseConfigHandler from '../../Utils/Classes/BaseConfigHandler';

export const command: SlashCommand = {
  category: 'Twitch',
  userPermissions: [ADMINISTRATOR],
  data: new SlashCommandBuilder()
    .setName('config-twitch')
    .setDescription('Configure twitch notifications')
    .addStringOption((option) =>
      option
        .setName('options')
        .setRequired(true)
        .addChoices([
          ['📷 Twitch Notifications ', 'EnableTwitchNotifications'],
          ['📺 Notifications Channel ', 'TwitchChannel'],
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
