import { SlashCommand } from '../../Interfaces';
import { bold, hyperlink, SlashCommandBuilder } from '@discordjs/builders';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Emojis } from '../../Utils/JSON/Emojis.json';
import Twitch from '../../Utils/Classes/Twitch';

export const command: SlashCommand = {
  category: 'Admin',
  userPermissions: [ADMINISTRATOR],
  data: new SlashCommandBuilder()
    .setName('twitch-follow')
    .setDescription('Add a Twitch channel to get notifications from. (by name)')
    .addStringOption((option) =>
      option
        .setName('channel')
        .setDescription('Add a Twitch channel to get notifications from. (by name)')
        .setRequired(true)
    ),
  run: async (interaction: CommandInteraction) => {
    const TwitchAPI = new Twitch(interaction.client);

    const HasNotifications = await TwitchAPI.CheckNotifications(interaction);
    if (!HasNotifications) return;

    const TwitchChannel = interaction.options.getString('channel');
    const data = await TwitchAPI.getUsers(TwitchChannel);

    if (!data) {
      return interaction.reply({ content: `I'm sorry, no channel was found with that name 😢`, ephemeral: true });
    }

    const ChannelsList = await TwitchAPI.GetList(interaction);
    const username = data.display_name;
    let ChannelCount = ChannelsList.length;

    // check if channel is already in the list
    if (ChannelsList.includes(username))
      return interaction.reply({ content: `You already have that channel added!`, ephemeral: true });

    // check if the the max amount of channels has been reached
    if (ChannelCount >= TwitchAPI.MaxFollowerChannels) {
      return interaction.reply({
        content: `You can only have ${bold(
          TwitchAPI.MaxFollowerChannels.toString()
        )} channels added at a time!\n Please use \`$/twitch-remove'\` before adding another.`,
        ephemeral: true,
      });
    }

    TwitchAPI.AddChannel(interaction, username);
    const URL = `https://twitch.tv/${username}`;

    const AddedToListEmbed = new MessageEmbed({
      title: username,
      color: 'GREEN',
      description: `${username} has been added to your list of Twitch channels!`,
      thumbnail: {
        url: data.profile_image_url,
      },
      fields: [
        {
          name: 'List Size',
          value: `\`${ChannelCount + 1}/${TwitchAPI.MaxFollowerChannels}\``,
          inline: true,
        },
        {
          name: 'To remove this channel',
          value: `use \`/twitch-remove ${username}\``,
          inline: true,
        },
      ],
      footer: {
        iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true }),
        text: `Added to list by ${interaction.user.tag}`,
      },
      url: URL,
    });

    const TwitchBaseIcon = interaction.client.emojis.cache.get(Emojis.TwitchBase);
    interaction.reply({
      content: `${TwitchBaseIcon} ${URL}`,
      embeds: [AddedToListEmbed],
      ephemeral: true,
    });
  },
};
