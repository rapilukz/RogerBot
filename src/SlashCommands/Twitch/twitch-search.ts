import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SEND_MESSAGES } from '../../Utils/Helpers/Permissions';
import Twitch from '../../Utils/APIs/Twitch';
import { UserData } from '../../Interfaces/Random';

export const command: SlashCommand = {
  category: 'Twitch',
  userPermissions: [SEND_MESSAGES],
  data: new SlashCommandBuilder()
    .setName('twitch-search')
    .setDescription('Search for a Twitch channel')
    .addStringOption((option) =>
      option.setName('channel').setRequired(true).setDescription('The channel to search for')
    ),
  run: async (interaction: CommandInteraction) => {
    const twitch = new Twitch(interaction.client);

    const TwitchChannel = interaction.options.getString('channel');
    const data: UserData = await twitch.GetUser(TwitchChannel);

    if (!data) {
      return interaction.reply({ content: `I'm sorry, no channel was found with that name 😢`, ephemeral: true });
    }

    const Followers = await twitch.GetFollowers(data.id);

    const url = `https://www.twitch.tv/${data.display_name}`;
    const embed = new MessageEmbed({
      title: `${data.display_name}`,
      url,
      description: `${data.description}`,
      thumbnail: {
        url: data.profile_image_url,
      },
      fields: [
        {
          name:  `💬 **Followers**`,
          value: `${Followers}`,
          inline: true,
        },
        {
          name: '👁 Views',
          value: `${data.view_count}`,
          inline: true,
        }
      ],
      color: '#A077FF',
      footer: {
        text: `@Twitch`,
        iconURL: 'https://static.techspot.com/images2/downloads/topdownload/2021/04/2021-04-07-ts3_thumbs-373.png',
      },
    });

    interaction.reply({
      content: url,
      embeds: [embed],
    });
  },
};
