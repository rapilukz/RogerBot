import { CommandInteraction } from 'discord.js';
import { Event } from '../Interfaces';
import {
  HandleDefaultRole,
  HandleFarewellChannel,
  HandleAnnouncementType,
  HandleTwitchNotifications,
  HandleWelcomeChannel,
  HandleTwitchChannel,
} from '../Utils/Helpers/RowHandlers';

export const event: Event = {
  name: 'interactionCreate',
  run: async (client, interaction: CommandInteraction) => {
    if (interaction.isCommand()) {
      const command = client.SlashCommands.get(interaction.commandName);
      if (!command) return;

      // Basic Permissions Check
      if (!interaction.memberPermissions.has(command.userPermissions)) {
        return interaction.reply({
          content: `You don't have the required permissions to use this command!`,
          ephemeral: true,
        });
      }

      try {
        await command.run(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }

    if (interaction.isSelectMenu()) {
      switch (interaction.customId) {
        case 'WelcomeChannel':
          await HandleWelcomeChannel(interaction);
          break;
        case 'FarewellChannel':
          await HandleFarewellChannel(interaction);
          break;
        case 'Role':
          await HandleDefaultRole(interaction);
          break;
        case 'AnnouncementType':
          await HandleAnnouncementType(interaction);
          break;
        case 'TwitchNotifications':
          await HandleTwitchNotifications(interaction);
          break;
        case 'TwitchChannel':
          await HandleTwitchChannel(interaction);
          break;
        default:
          interaction.reply({ content: `Something went wrong!`, ephemeral: true });
          break;
      }
    }
  },
};
