import { SlashCommand } from '../../Interfaces';
import { bold, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ADMINISTRATOR } from '../../Utils/Helpers/Permissions';
import Twitch from '../../Utils/Classes/Twitch';

export const command: SlashCommand = {
  category: 'Twitch',
  userPermissions: [ADMINISTRATOR],
  data: new SlashCommandBuilder()
    .setName('twitch-remove')
    .setDescription('Remove a Twitch channel from the list of channels to notify')
    .addStringOption((option) =>
      option.setName('channel').setRequired(true).setDescription('The Twitch channel to remove')
    ),
  run: async (interaction: CommandInteraction) => {
    const TwitchAPI = new Twitch(interaction.client);

    const HasNotifications = await TwitchAPI.CheckNotifications(interaction);
    if (!HasNotifications) return;

    const TwitchChannel = interaction.options.getString('channel');
    const ChannelList: string[] = await TwitchAPI.GetNamesList(interaction);

    if (!ChannelList.includes(TwitchChannel)) {
      return interaction.reply({
        content: `${bold(
          TwitchChannel
        )} doesn't exist in your list!\nUse \`/twitch-list\` to see the channels that are being followed.`,
        ephemeral: true,
      });
    }

    TwitchAPI.RemoveChannel(interaction, TwitchChannel);
    interaction.reply({
      content: `\`${TwitchChannel}\` has been removed from your list of followed channels 😢`,
      ephemeral: true,
    });
  },
};
