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
import { GetFromDB, SendoToDB } from '../../Utils/Functions';

export const command: SlashCommand = {
  category: 'Admin',
  data: new SlashCommandBuilder().setName('config').setDescription('Configure the bot').setDefaultPermission(true),
  run: async (interaction: CommandInteraction) => {
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

const SendWelcomeRow = async (interaction: SelectMenuInteraction<CacheType>, options: any[]) => {
  //Current Welcome Channel
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('WelcomeChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );
  
  const CurrentChannel = await GetFromDB("WelcomeChannelName", interaction);
   
  await interaction.reply({
    content: `Set the Server's Welcome Channel 🎉`,
    components: [row],
    embeds: [{
      title: 'Current Channel',
      description: `Current Channel: \`${CurrentChannel}\``,
      color: 'RANDOM',
    }],
    ephemeral: true,
  });
};

const SendGoodbyeRow = async (interaction: SelectMenuInteraction<CacheType>, options: any[]) => {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu().setCustomId('GoodbyeChannel').setPlaceholder('Available Channels 📚').addOptions(options)
  );
  
  const CurrentChannel = await GetFromDB("GoodbyeChannel", interaction);

  await interaction.reply({
    content: `Set the Server's Goodbye Channel 😢`,
    components: [row],
    embeds: [{
      title: 'Current Channel',
      description: `Current Channel: \`${CurrentChannel}\``,
      color: 'RANDOM',
    }],
    ephemeral: true,
  });
};

export const HandleConfigOptions = async (
  interaction: SelectMenuInteraction<CacheType>,
  options: MessageSelectOptionData[] | MessageSelectOptionData[][]
) => {
  interaction.values.forEach(async (value) => {
    switch (value) {
      case 'Welcome':
        SendWelcomeRow(interaction, options);
        break;
      case 'Goodbye':
        SendGoodbyeRow(interaction, options);
        break;
      default:
        await interaction.reply({ content: 'Something went wrong', ephemeral: true });
        break;
    }
  });
};

export const HandleWelcomeChannel = async ( interaction: SelectMenuInteraction<CacheType>, options: MessageSelectOptionData[] | MessageSelectOptionData[][]) => {
  interaction.values.forEach(async (value) => {
    const Label = GetLabel(options, value);
    //Send the ID and the Channel Name to the DB
   
    SendoToDB('WelcomeChannelID', value, interaction);
    SendoToDB('WelcomeChannelName', Label, interaction);
    
    interaction.reply({ embeds: [{ 
      title: 'Welcome Channel',
      description: `Welcome Channel set to \`${Label}\`` ,
      color: 'GREEN',
      timestamp: new Date(),
      footer: {
        text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
        icon_url: interaction.user.avatarURL(),
      },
    }], ephemeral: true });
  });
};

export const HandleGoodbyeChannel = async ( interaction: SelectMenuInteraction<CacheType>, options: MessageSelectOptionData[] | MessageSelectOptionData[][]) => {
  interaction.values.forEach(async (value) => {
    const Label = GetLabel(options, value);
    //Send the ID and the Channel Name to the DB
   
    SendoToDB('GoodbyeChannelID', value, interaction);
    SendoToDB('GoodbyeChannelName', Label, interaction);
    
    interaction.reply({ embeds: [{ 
      title: 'Goodbye Channel',
      description: `Goodbye Channel set to \`${Label}\`` ,
      color: 'GREEN',
      timestamp: new Date(),
      footer: {
        text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
        icon_url: interaction.user.avatarURL(),
      },
    }], ephemeral: true });
  });
};


const GetLabel = (options: MessageSelectOptionData[] | MessageSelectOptionData[][], value: string) => {
  let label = '';
  options.forEach((option) => {
    if (option.value === value) {
      label = option.label;
    }
  });
  return label;
};
