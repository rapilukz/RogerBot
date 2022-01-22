import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ADMINISTRATOR } from '../../Utils/Permissions';
import {
  CacheType,
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
  SelectMenuInteraction,
} from 'discord.js';
import { GetChannels, GetFromDBInteraction, GetLabel, GetRoles, SendoToDB } from '../../Utils/Functions';
import { DBFields } from '../../config.json';

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
          ['😠 Goodbye Channel 😠', 'Goodbye'],
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
          case 'Goodbye':
            SendGoodbyeRow(interaction, Channels);
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

  const CurrentRole = await GetFromDBInteraction(DBFields.DefaultRoleName, interaction);
  await interaction.reply({
    content: 'dsada',
    components: [row],
    embeds: [
      {
        title: 'Default Role',
        description: `Default Role: \`${CurrentRole}\``,
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

  const CurrentChannel = await GetFromDBInteraction(DBFields.WelcomeChannelName, interaction);

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

const SendGoodbyeRow = async (
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>,
  options: any[]
) => {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('GoodbyeChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );

  const CurrentChannel = await GetFromDBInteraction(DBFields.GoodbyeChannelName, interaction);

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

export const HandleWelcomeChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
  const options = await GetChannels(interaction, 'GUILD_TEXT');
  interaction.values.forEach(async (value) => {
    //Value is the id of the channel
    const Label = GetLabel(options, value);
    
    SendoToDB(DBFields.WelcomeChannelID, value, interaction);
    SendoToDB(DBFields.WelcomeChannelName, Label, interaction); 
    
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

      SendoToDB(DBFields.DefaultRoleID, value, interaction);
      SendoToDB(DBFields.DefaultRoleName, Label, interaction);

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

export const HandleGoodbyeChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
  const options = await GetChannels(interaction, 'GUILD_TEXT');
  interaction.values.forEach(async (value) => {
    const Label = GetLabel(options, value);
    //Send the ID and the Channel Name to the DB
    
    SendoToDB(DBFields.GoodbyeChannelID, value, interaction);
    SendoToDB(DBFields.GoodbyeChannelName, Label, interaction);

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
