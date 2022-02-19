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
import { GetChannels, GetLabel, GetRoles } from '../../Utils/Helpers/Functions';
import { DBFields } from '../../Utils/JSON/DBFields.json';
import WelcomeSchema from '../../Utils/Schemas/Welcome';
import FarewellSchema from '../../Utils/Schemas/Farewell';
import GuildSchema from '../../Utils/Schemas/Guild';
import TwitchSchema from '../../Utils/Schemas/Twitch';
import { BotMessageType, TypesOfMessage } from '../../Interfaces/Random';
import { GetFromDB } from '../../Utils/Helpers/MongoFunctions';
import { Emojis } from '../../Utils/JSON/Emojis.json';
import Client from '../../Client';
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
          ['✍️ Announcement Type ', 'Message'],
          ['📷 Twitch Notifications ', 'EnableTwitchNotifications'],
          ['📜 Default Role ', 'Role'],
        ])
        .setDescription('Select an option')
    ),
  run: async (interaction: CommandInteraction, client) => {
    const Channels = await GetChannels(interaction, 'GUILD_TEXT');
    if (interaction.isAutocomplete) {
      interaction.options.data.forEach((option) => {
        switch (option.value) {
          case 'Welcome':
            Welcome(interaction, Channels);
            break;
          case 'Farewell':
            Farewell(interaction, Channels);
            break;
          case 'Role':
            Role(interaction);
            break;
          case 'Message':
            AnnouncementType(interaction);
            break;
          case 'EnableTwitchNotifications':
            EnableTwitchNotification(interaction,);
            break;
          
          default:
            interaction.reply({ content: `Something went wrong!`, ephemeral: true });
        }
      });
    }
  },
};

/* AnnouncementType */
const AnnouncementType = async (interaction: CommandInteraction) => {
  const MessageTypes: BotMessageType[] = Object.values(TypesOfMessage);
  const List: MessageSelectOptionData[] = [];
  const AnnouncementField = DBFields.GuildSchema.AnnouncementType;

  const guildId = interaction.guildId;
  const guildName = interaction.guild.name;

  const CurrentType = await GetFromDB(AnnouncementField, GuildSchema, guildId, guildName);

  MessageTypes.forEach((type) => {
    List.push({
      label: type,
      value: type,
    });
  });

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('AnnouncementType').setPlaceholder('Available Types 📚').addOptions(List)
  );

  await interaction.reply({
    components: [row],
    embeds: [
      {
        title: '🎉 Current Announcement Type ',
        description: `Announcement type: \`${CurrentType == null ? 'None' : CurrentType}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
};

/* Welcome */
const Welcome = async (
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>,
  options: any[]
) => {
  //Current Welcome Channel
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('WelcomeChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );

  const ChannelField = DBFields.WelcomeSchema.ChannelName;
  const guildId = interaction.guildId;
  const guildName = interaction.guild.name;

  const CurrentChannel = await GetFromDB(ChannelField, WelcomeSchema, guildId, guildName);

  await interaction.reply({
    components: [row],
    embeds: [
      {
        title: '👋 Current Channel',
        description: `Current Channel: \`${CurrentChannel == null ? 'None' : CurrentChannel}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
};

/* Farewell */
const Farewell = async (
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>,
  options: any[]
) => {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('FarewellChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );

  const ChannelField = DBFields.FarewellSchema.ChannelName;
  const guildId = interaction.guildId;
  const guildName = interaction.guild.name;
  const CurrentChannel = await GetFromDB(ChannelField, FarewellSchema, guildId, guildName);

  await interaction.reply({
    components: [row],
    embeds: [
      {
        title: '😢 Farewell Channel',
        description: `Current Channel: \`${CurrentChannel == null ? 'None' : CurrentChannel}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
};

/* Role  */
const Role = async (interaction: CommandInteraction) => {
  const ListOfRoles = await GetRoles(interaction);
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('Role').setPlaceholder('Available Roles 📚').addOptions(ListOfRoles)
  );

  const RoleField = DBFields.GuildSchema.DefaultRoleName;

  const guildId = interaction.guildId;
  const guildName = interaction.guild.name;

  const CurrentRole = await GetFromDB(RoleField, GuildSchema, guildId, guildName);
  await interaction.reply({
    components: [row],
    embeds: [
      {
        title: '📚 Default Role',
        description: `Default Role: \`${CurrentRole == null ? 'None' : CurrentRole}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
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

const TwitchNotificationChannel = async (interaction: CommandInteraction) => {
   
}