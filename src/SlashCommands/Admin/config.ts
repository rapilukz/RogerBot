import { SlashCommand } from '../../Interfaces';
import { bold, SlashCommandBuilder } from '@discordjs/builders';
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
import { BotMessageType, TypesOfMessage } from '../../Interfaces/Random';
import { GetFromDB } from '../../Utils/Helpers/MongoFunctions';

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
          ['📜 Default Role ', 'Role'],
        ])
        .setDescription('Select an option')
    ),
  run: async (interaction: CommandInteraction) => {
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
          default:
            interaction.reply({ content: `Something went wrong!`, ephemeral: true });
        }
      });
    }
  },
};

/* AnnouncementType */
const AnnouncementType = async (interaction: CommandInteraction) => {
  const MessageTypes: BotMessageType[] = Object.values(TypesOfMessage);   //Sets the value of the enum to an array
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
  options: MessageSelectOptionData[]
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
  options: MessageSelectOptionData[]
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
