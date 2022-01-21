import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CacheType,
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
  SelectMenuInteraction,
} from 'discord.js';
import { GetChannels, GetFromDB, GetLabel, SendoToDB } from '../../Utils/Functions';

export const command: SlashCommand = {
  category: 'Admin',
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure the bot')
    .setDefaultPermission(true)
    .addStringOption((option) =>
      option
        .setName('options')
        .setDescription('Available Options: Welcome | Goodbye ')
        .setRequired(true)
        .addChoices([
          ['👋 Welcome Channel 👋', 'Welcome'],
          ['😠 Goodbye Channel 😠', 'Goodbye'],
        ])
    ),
  run: async (interaction: CommandInteraction) => {
    
    const options = await GetChannels(interaction, 'GUILD_TEXT');
    if (interaction.isAutocomplete) {
      interaction.options.data.forEach((option) => {
        switch (option.value) {
          case 'Welcome':
            SendWelcomeRow(interaction, options);
            break;
          case 'Goodbye':
            SendGoodbyeRow(interaction, options);
            break;
          default:
            interaction.reply({ content: `Something went wrong!` });
        }
      });
    }
  },
};

const SendWelcomeRow = async (interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>, options: any[]) => {
  //Current Welcome Channel
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('WelcomeChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );

  const CurrentChannel = await GetFromDB('WelcomeChannelName', interaction);

  await interaction.reply({
    content: `Set the Server's Welcome Channel 🎉`,
    components: [row],
    embeds: [
      {
        title: 'Current Channel',
        description: `Current Channel: \`${CurrentChannel}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
};

const SendGoodbyeRow = async (interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>, options: any[]) => {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('GoodbyeChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );

  const CurrentChannel = await GetFromDB('GoodbyeChannelName', interaction);

  await interaction.reply({
    content: `Set the Server's Goodbye Channel 😢`,
    components: [row],
    embeds: [
      {
        title: 'Current Channel',
        description: `Current Channel: \`${CurrentChannel}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
};

export const HandleWelcomeChannel = async (
  interaction: SelectMenuInteraction<CacheType>,
  options: MessageSelectOptionData[] | MessageSelectOptionData[][]
) => {
  interaction.values.forEach(async (value) => {
    const Label = GetLabel(options, value);
    //Send the ID and the Channel Name to the DB

    SendoToDB('WelcomeChannelID', value, interaction);
    SendoToDB('WelcomeChannelName', Label, interaction);

    interaction.reply({
      embeds: [
        {
          title: 'Welcome Channel',
          description: `Welcome Channel set to \`${Label}\``,
          color: 'GREEN',
          timestamp: new Date(),
          footer: {
            text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
            icon_url: interaction.user.avatarURL(),
          },
        },
      ],
      ephemeral: true,
    });
  });
};

export const HandleGoodbyeChannel = async (
  interaction: SelectMenuInteraction<CacheType>,
  options: MessageSelectOptionData[] | MessageSelectOptionData[][]
) => {
  interaction.values.forEach(async (value) => {
    const Label = GetLabel(options, value);
    //Send the ID and the Channel Name to the DB

    SendoToDB('GoodbyeChannelID', value, interaction);
    SendoToDB('GoodbyeChannelName', Label, interaction);

    interaction.reply({
      embeds: [
        {
          title: 'Goodbye Channel',
          description: `Goodbye Channel set to \`${Label}\``,
          color: 'GREEN',
          timestamp: new Date(),
          footer: {
            text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
            icon_url: interaction.user.avatarURL(),
          },
        },
      ],
      ephemeral: true,
    });
  });
};

