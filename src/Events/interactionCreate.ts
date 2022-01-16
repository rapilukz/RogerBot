import { CommandInteraction } from 'discord.js';
import { Event } from '../Interfaces';
import { WelcomeRow } from '../SlashCommands/Admin/config';
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

       if(interaction.customId === 'ConfigOptions'){

          await interaction.values.forEach(async value => {
             
              switch(value){
                  case 'Welcome':
                    await interaction.reply({ content: 'Welcome Channel Options', components:[WelcomeRow(options)],ephemeral: true });
                    break;
                  default:
                    await interaction.reply({ content: 'Something went wrong', ephemeral: true });
                    break;
              }     
                     
          })
       }
    }
  },
};
