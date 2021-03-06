import { SlashCommand } from '../../Interfaces';
import { bold, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SEND_MESSAGES } from '../../Utils/Helpers/Permissions';
import Twitch from '../../Utils/Classes/Twitch';
import { Emojis } from '../../Utils/Helpers/Emojis';
import { TwitchChannel } from '../../Interfaces/Random';

export const command: SlashCommand = {
  category: 'Twitch',
  userPermissions: [SEND_MESSAGES],
  data: new SlashCommandBuilder().setName('twitch-list').setDescription('List of the channels that are being followed'),
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

    const ChannelList: TwitchChannel[] = await TwitchAPI.GetChannelsList(interaction.guildId, interaction.guild.name);

    const TwitchEmoji = interaction.client.emojis.cache.get(Emojis.TwitchBack);
    const Embed = new MessageEmbed({
      title: `${TwitchEmoji}List of followed Twitch channels`,
      color: '#A077FF',
      description: `\`${ChannelList.map((channel, index) => `${index + 1}.${channel._id}`).join('\n')}\``,
      fields: [
        {
          name: 'List Size',
          value: `\`${ChannelList.length.toString()}/${TwitchAPI.MaxFollowedChannels}\``,
          inline: true,
        },
        {
          name: 'To add channels',
          value: 'Use`/twitch-add`',
          inline: true,
        },
        {
          name: 'To remove channels',
          value: 'Use `/twitch-remove`',
          inline: true,
        },
      ],
      footer: {
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true }),
      },
      thumbnail: {
        url: interaction.guild.iconURL({ format: 'png', dynamic: true }),
      },
    });

    interaction.reply({ embeds: [Embed] });
  },
};
