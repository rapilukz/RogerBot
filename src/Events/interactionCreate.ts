import { CommandInteraction } from 'discord.js';
import { Event } from '../Interfaces';
import SelectMenuHandler from '../Utils/Classes/SelectMenuHandler';

export const event: Event = {
  name: 'interactionCreate',
  run: async (client, interaction: CommandInteraction) => {
    if (interaction.isCommand()) {
      if (!interaction.guild) return interaction.reply('This command can only be used in a server');
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
      const MenuHandler = new SelectMenuHandler(interaction);
      await MenuHandler.ExecuteHandlers(interaction.customId);
    }
  },
};
