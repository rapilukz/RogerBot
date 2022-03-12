import { SlashCommand } from '../../Interfaces';
import { bold, SlashCommandBuilder } from '@discordjs/builders';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Emojis } from '../../Utils/JSON/Emojis.json';
import Twitch from '../../Utils/APIs/Twitch';
import { TwitchChannel, UserData } from '../../Interfaces/Random';

export const command: SlashCommand = {
  category: 'Twitch',
  userPermissions: [ADMINISTRATOR],
  data: new SlashCommandBuilder()
    .setName('twitch-add')
    .setDescription('Add a Twitch channel to get notifications from. (by name)')
    .addStringOption((option) =>
      option
        .setName('channel')
        .setDescription('Add a Twitch channel to get notifications from. (by name)')
        .setRequired(true)
    ),
  run: async (interaction: CommandInteraction) => {
    const TwitchAPI = new Twitch(interaction.client);

    const HasNotifications = await TwitchAPI.CheckNotifications(interaction.guildId, interaction.guild.name);
    if (!HasNotifications){
      return interaction.reply({
        content: `This server doesn't have Twitch notifications ${bold(
          'enabled!'
        )}\nPlease use \`/config-twitch\` to enable it. `,
        ephemeral: true,
      });
    };

    const TwitchChannel = interaction.options.getString('channel');
    const data: UserData = await TwitchAPI.GetUser(TwitchChannel);

    if (!data) {
      return interaction.reply({ content: `I'm sorry, no channel was found with that name 😢`, ephemeral: true });
    }

    const ChannelsList: TwitchChannel[] = await TwitchAPI.GetChannelsList(interaction.guildId, interaction.guild.name);
    // Check if the channel is already in the list

    let ChannelCount: number = ChannelsList.length;
    
    const username: string = data.display_name;
    const ChannelExists = ChannelsList.find((channel) => channel._id === username);

    // check if channel is already in the list
    if (ChannelExists) return interaction.reply({ content: `You already have that channel added!`, ephemeral: true });

    // check if the the max amount of channels has been reached
    if (ChannelCount >= TwitchAPI.MaxFollowedChannels) {
      return interaction.reply({
        content: `You can only have ${bold(
          TwitchAPI.MaxFollowedChannels.toString()
        )} channels added at a time!\n Please use \`$/twitch-remove'\` before adding another.`,
        ephemeral: true,
      });
    }

    //If everything is good, add the channel to the list
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
          value: `\`${ChannelCount + 1}/${TwitchAPI.MaxFollowedChannels}\``,
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
