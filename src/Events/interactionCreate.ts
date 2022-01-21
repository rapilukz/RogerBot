import { CommandInteraction } from 'discord.js';
import { Event } from '../Interfaces';
import { HandleGoodbyeChannel, HandleWelcomeChannel } from '../SlashCommands/Admin/config';
import { GetChannels } from '../Utils/Functions';

export const event: Event = {
  name: 'interactionCreate',
  run: async (client, interaction: CommandInteraction) => {
    if (interaction.isCommand()) {
      const command = client.SlashCommands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.run(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }

    const options = await GetChannels(interaction, 'GUILD_TEXT');
    if (interaction.isSelectMenu()) {
      switch (interaction.customId) {
        case 'WelcomeChannel':
          await HandleWelcomeChannel(interaction, options);
          break;
        case 'GoodbyeChannel':
          await HandleGoodbyeChannel(interaction, options);
          break;
        default:
          break;
      }
    }
  },
};
