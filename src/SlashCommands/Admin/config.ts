import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ADMINISTRATOR } from '../../Utils/Permissions';
import {
  CacheType,
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from 'discord.js';
import { GetChannels, GetFromDB, GetLabel, GetRoles, SendoToDB } from '../../Utils/Functions';
import { DBFields } from '../../config.json';
import WelcomeSchema from '../../Utils/Schemas/Welcome';
import FarewellSchema from '../../Utils/Schemas/Farewell';
import GuildSchema from '../../Utils/Schemas/Guild';


export const command: SlashCommand = {
  category: 'Admin',
  userPermissions: [ADMINISTRATOR],
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure the bot')
    .addStringOption((option) =>
      option
        .setName('options')
        .setDescription('Available Options: Welcome | Goodbye ')
        .setRequired(true)
        .addChoices([
          ['👋 Welcome Channel 👋', 'Welcome'],
          ['😠 Farewell Channel 😠', 'Farewell'],
          ['📜 Default Role 📜', 'Role'],
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
          default:
            interaction.reply({ content: `Something went wrong!` });
        }
      });
    }
  },
};

const SendRoleRow = async (interaction: CommandInteraction) => {
  const ListOfRoles = await GetRoles(interaction);
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('Role').setPlaceholder('Available Roles 📚').addOptions(ListOfRoles)
  );

  const CurrentRole = await GetFromDB(DBFields.DefaultRoleName, GuildSchema, interaction);
  await interaction.reply({
    components: [row],
    embeds: [
      {
        title: 'Default Role',
        description: `Default Role: \`${CurrentRole == null ? 'None' : CurrentRole}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
};

const SendWelcomeRow = async (
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>,
  options: any[]
) => {
  //Current Welcome Channel
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('WelcomeChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );
  
  const ChannelField = DBFields.WelcomeSchema.ChannelName;
  const CurrentChannel = await GetFromDB(ChannelField, WelcomeSchema, interaction);

  await interaction.reply({
    content: `Set the Server's Welcome Channel 🎉`,
    components: [row],
    embeds: [
      {
        title: 'Current Channel',
        description: `Current Channel: \`${CurrentChannel == null ? 'None' : CurrentChannel}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
};

const SendFarewellRow = async (
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>,
  options: any[]
) => {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('FarewellChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );
  
  const ChannelField = DBFields.FarewellSchema.ChannelName;
  const CurrentChannel = await GetFromDB(ChannelField, FarewellSchema, interaction);

  await interaction.reply({
    content: `Set the Server's Farewell Channel 😢`,
    components: [row],
    embeds: [
      {
        title: 'Current Channel',
        description: `Current Channel: \`${CurrentChannel == null ? 'None' : CurrentChannel}\``,
        color: 'RANDOM',
      },
    ],
    ephemeral: true,
  });
};

export const HandleWelcomeChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
  const options = await GetChannels(interaction, 'GUILD_TEXT');
  interaction.values.forEach(async (value) => {
    //Value is the id of the channel
    const Label = GetLabel(options, value);
    const ChannelName = DBFields.WelcomeSchema.ChannelName;
    const ChannelID = DBFields.WelcomeSchema.ChannelID;

    await SendoToDB(ChannelName, value, WelcomeSchema, interaction, );
    await SendoToDB(ChannelID, Label,  WelcomeSchema, interaction); 
    
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

export const HandleDefaultRole = async (interaction: SelectMenuInteraction<CacheType>) => {
  const options = await GetRoles(interaction);
  interaction.values.forEach(async (value) => {
      const Label = GetLabel(options, value);

      await SendoToDB(DBFields.DefaultRoleID, value, GuildSchema, interaction);
      await SendoToDB(DBFields.DefaultRoleName, Label, GuildSchema, interaction );

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

export const HandleFarewellChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
  const options = await GetChannels(interaction, 'GUILD_TEXT');
  interaction.values.forEach(async (value) => {
    const Label = GetLabel(options, value);
    //Send the ID and the Channel Name to the DB
    
    const ChannelName = DBFields.FarewellSchema.ChannelName;
    const ChannelID = DBFields.FarewellSchema.ChannelID;

    
    await SendoToDB(ChannelName, value, FarewellSchema, interaction,);
    await SendoToDB(ChannelID, Label, FarewellSchema,  interaction,);

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
