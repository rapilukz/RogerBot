import { CommandInteraction } from 'discord.js';
import { Event } from '../Interfaces';
import RowHandlers from '../Utils/Helpers/RowHandlers';
import WelcomeSchema from '../Utils/Schemas/Welcome';
import FarewellSchema from '../Utils/Schemas/Farewell';
import GuildSchema from '../Utils/Schemas/Guild';
import TwitchSchema from '../Utils/Schemas/Twitch';

export const event: Event = {
  name: 'interactionCreate',
  run: async (client, interaction: CommandInteraction) => {
    if (interaction.isCommand()) {
      if(!interaction.guild) return interaction.reply('This command can only be used in a server');
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
        await command.run(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }

    if (interaction.isSelectMenu()) {
      const RowHandler = new RowHandlers(interaction);

      switch (interaction.customId) {
        case 'WelcomeChannel':
          await RowHandler.ChannelHandler('Welcome Channel', WelcomeSchema);
          break;
        case 'FarewellChannel':
          await RowHandler.ChannelHandler('Farewell Channel', FarewellSchema);
          break;
        case 'Role':
          await RowHandler.CustomHandler('Default Role', GuildSchema, 'DefaultRoleID');
          break;
        case 'AnnouncementType':
          await RowHandler.CustomHandler('Announcement Type', GuildSchema, 'AnnouncementType');
          break;
        case 'TwitchNotifications':
          await RowHandler.CustomHandler('Twitch Notifications', TwitchSchema, 'NotificationsEnabled');
          break;
        case 'TwitchChannel':
          await RowHandler.ChannelHandler('Twitch Channel', TwitchSchema);
          break;
        default:
          interaction.reply({ content: `Something went wrong!`, ephemeral: true });
          break;
      }
    }
  },
};
