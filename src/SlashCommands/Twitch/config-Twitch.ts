import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions';
import {
  CacheType,
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
  SelectMenuInteraction,
} from 'discord.js';
import { GetChannelByID, GetChannels } from '../../Utils/Helpers/Functions';
import { GetFromDB } from '../../Utils/Helpers/MongoFunctions';
import { Emojis } from '../../Utils/JSON/Emojis.json';
import TwitchSchema from '../../Utils/Schemas/Twitch';
import { DBFields } from '../../Utils/JSON/DBFields.json';

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
    const Channels = await GetChannels(interaction, 'GUILD_TEXT');
    if (interaction.isAutocomplete) {
      interaction.options.data.forEach((option) => {
        switch (option.value) {
          case 'EnableTwitchNotifications':
            EnableTwitchNotification(interaction);
            break;
          case 'TwitchChannel':
            TwitchChannel(interaction, Channels);
            break;
          default:
            interaction.reply({ content: `Something went wrong!`, ephemeral: true });
        }
      });
    }
  },
};

/* Enable Twitch Notifications */
const EnableTwitchNotification = async (interaction: CommandInteraction) => {
  const options: MessageSelectOptionData[] = [
    {
      label: 'Enable',
      value: 'true',
      emoji: '✅',
    },
    {
      label: 'Disable',
      value: 'false',
      emoji: '❌',
    },
  ];
  const guildId = interaction.guildId;
  const guildName = interaction.guild.name;
  const TwitchField = DBFields.TwitchSchema.NotificationsEnabled;

  const CurrentState = await GetFromDB(TwitchField, TwitchSchema, guildId, guildName);
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('TwitchNotifications')
      .setPlaceholder('Enable/Disable Notifications')
      .addOptions(options)
  );

  const TwitchIcon = interaction.client.emojis.cache.get(Emojis.TwitchBack);

  await interaction.reply({
    components: [row],
    embeds: [
      {
        title: `${TwitchIcon} Twitch Notifications`,
        fields: [
          {
            name: 'Current State:',
            value: `${CurrentState == null ? '❌ **Disabled**' : ' ✅ **Enabled**'}`,
          },
        ],
        thumbnail: {
          url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthisonlineworld.com%2Fwp-content%2Fuploads%2F2018%2F02%2Ftwitch-app-logo.jpg&f=1&nofb=1',
        },
        color: '#A077FF',
      },
    ],
    ephemeral: true,
  });
};

const TwitchChannel = async (
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>,
  options: MessageSelectOptionData[]
) => {
  const TwitchIcon = interaction.client.emojis.cache.get(Emojis.TwitchBack);
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('TwitchChannel').setPlaceholder(`Available Channels 📚`).addOptions(options)
  );

  const ChannelField = DBFields.TwitchSchema.ChannelID;
  const guildId = interaction.guildId;
  const guildName = interaction.guild.name;

  const NotificationsEnabled = DBFields.TwitchSchema.NotificationsEnabled;
  const isEnabled = await GetFromDB(NotificationsEnabled, TwitchSchema, guildId, guildName);

  if (!isEnabled) {
    return interaction.reply({
      content: `${TwitchIcon} Twitch Notifications are **disabled**. Please enable them first with \`/config\``,
      ephemeral: true,
    });
  }

  const ChannelID = await GetFromDB(ChannelField, TwitchSchema, guildId, guildName);
  const CurrentChannel = GetChannelByID(interaction, ChannelID);

  await interaction.reply({
    components: [row],
    embeds: [
      {
        title: `${TwitchIcon} Twitch Notifications Channel`,
        description: `Current Channel: ${CurrentChannel == null ? '`None`' : `\`${CurrentChannel}\``}`,
        color: '#A077FF',
      },
    ],
    ephemeral: true,
  });
};
