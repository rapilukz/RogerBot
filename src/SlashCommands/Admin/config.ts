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
import { DBFields } from '../../Utils/DBFields.json';
import WelcomeSchema from '../../Utils/Schemas/Welcome';
import FarewellSchema from '../../Utils/Schemas/Farewell';
import GuildSchema from '../../Utils/Schemas/Guild';
import TwitchSchema from '../../Utils/Schemas/Twitch';
import { BotMessageType, TypesOfMessage } from '../../Interfaces/Random';
import { GetFromDB, SendoToDB } from '../../Utils/Helpers/MongoFunctions';

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
          ['📷 Twitch Notifications ', 'Notifications'],
          ['📜 Default Role ', 'Role'],
        ])
    ),
  run: async (interaction: CommandInteraction) => {
    const Channels = await GetChannels(interaction, 'GUILD_TEXT');
    if (interaction.isAutocomplete) {
      interaction.options.data.forEach((option) => {
        switch (option.value) {
          case 'Welcome':
            SendWelcomeRow(interaction, Channels);
            break;
          case 'Farewell':
            SendFarewellRow(interaction, Channels);
            break;
          case 'Role':
            SendRoleRow(interaction);
            break;
          case 'Message':
            SendAnnouncementTypeRow(interaction);
            break;
          case 'Notifications':
            SendTwitchNotificationRow(interaction);
            break;
          default:
            interaction.reply({ content: `Something went wrong!`, ephemeral: true });
        }
      });
    }
  },
};

/* AnnouncementType */
const SendAnnouncementTypeRow = async (interaction: CommandInteraction) => {
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

export const HandleAnnouncementType = async (interaction: SelectMenuInteraction<CacheType>) => {
  const AnnouncementField = DBFields.GuildSchema.AnnouncementType;
  const guildId = interaction.guildId;
  interaction.values.forEach(async (value) => {
    await SendoToDB(AnnouncementField, value, GuildSchema, guildId);

    interaction.reply({
      embeds: [
        {
          title: 'Announcement Type',
          description: `Announcement type set to \`${value}\``,
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

/* Welcome */
const SendWelcomeRow = async (
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

export const HandleWelcomeChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
  const options = await GetChannels(interaction, 'GUILD_TEXT');
  const guildId = interaction.guildId;
  interaction.values.forEach(async (value) => {
    //Value is the id of the channel
    const Label = GetLabel(options, value);
    const ChannelName = DBFields.WelcomeSchema.ChannelName;
    const ChannelID = DBFields.WelcomeSchema.ChannelID;

    await SendoToDB(ChannelID, value, WelcomeSchema, guildId);
    await SendoToDB(ChannelName, Label, WelcomeSchema, guildId);

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

/* Farewell */
const SendFarewellRow = async (
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

export const HandleFarewellChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
  const options = await GetChannels(interaction, 'GUILD_TEXT');
  const guildId = interaction.guildId;
  interaction.values.forEach(async (value) => {
    const Label = GetLabel(options, value);
    //Send the ID and the Channel Name to the DB

    const ChannelName = DBFields.FarewellSchema.ChannelName;
    const ChannelID = DBFields.FarewellSchema.ChannelID;

    await SendoToDB(ChannelID, value, FarewellSchema, guildId);
    await SendoToDB(ChannelName, Label, FarewellSchema, guildId);

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

/* Role  */
const SendRoleRow = async (interaction: CommandInteraction) => {
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
export const HandleDefaultRole = async (interaction: SelectMenuInteraction<CacheType>) => {
  const options = await GetRoles(interaction);
  const guildId = interaction.guildId;
  interaction.values.forEach(async (value) => {
    const Label = GetLabel(options, value);

    const RoleName = DBFields.GuildSchema.DefaultRoleName;
    const RoleID = DBFields.GuildSchema.DefaultRoleID;
    await SendoToDB(RoleID, value, GuildSchema, guildId);
    await SendoToDB(RoleName, Label, GuildSchema, guildId);

    interaction.reply({
      embeds: [
        {
          title: 'Default Role',
          description: `Default Role set to \`${Label}\``,
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

/* Enable Twitch Notifications */
const SendTwitchNotificationRow = async (interaction: CommandInteraction) => {
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

  await interaction.reply({
    components: [row],
    embeds: [
      {
        title: '📸 Twitch Notifications',
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

export const HandleTwitchNotifications = async (interaction: SelectMenuInteraction<CacheType>) => {
  const guildId = interaction.guildId;
  const DBField = DBFields.TwitchSchema.NotificationsEnabled;
  interaction.values.forEach(async (value) => {
    await SendoToDB(DBField, value, TwitchSchema, guildId);

    interaction.reply({
      embeds: [
        {
          title: '📸 Twitch Notifications',
          fields: [
            {
              name: 'Notifications set to:',
              value: `${value == 'true' ? '✅ **Enabled**' : '❌ **Disabled**'}`,
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
  });
};
