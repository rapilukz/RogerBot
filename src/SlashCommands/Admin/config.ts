import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageOptions, MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { GetChannels } from '../../Utils/Functions';

export const command: SlashCommand = {
  category: 'Admin',
  data: new SlashCommandBuilder().setName('config').setDescription('Configure the bot').setDefaultPermission(true),
  run: async (interaction) => {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('ConfigOptions')
        .setPlaceholder('Options 📚')
        .addOptions([
          {
            label: 'Welcome Channel',
            emoji: '👋',
            value: 'Welcome',
          },
          {
            label: 'Goodbye Channel',
            emoji: '😠',
            value: 'Goodbye',
          },
          {
            label: 'Moderation Channel',
            emoji: '🔨',
            value: 'Moderation',
          },
        ])
    );

    await interaction.reply({ content: `What do you want to config?`, components: [row], ephemeral: true });
  },
};


export const WelcomeRow = (options) =>{
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('TextChannels')
        .setPlaceholder('Text Channels 📚')
        .addOptions(options) 
    );
    return row;
}
