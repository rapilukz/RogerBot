import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { BAN_MEMBERS } from '../../Utils/Helpers/Permissions';

export const command: SlashCommand = {
  category: 'Moderation',
  userPermissions: [BAN_MEMBERS],
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server')
    .addUserOption((option) => option.setName('user').setRequired(true).setDescription('The user to ban'))
    .addStringOption((option) => option.setName('reason').setRequired(false).setDescription('The reason for the ban')),
  run: async (interaction: CommandInteraction) => {
    const user = interaction.options.getUser('user');
    let reason = interaction.options.getString('reason');
    const target = interaction.guild.members.cache.get(user.id);

    if (reason === null) reason = 'No reason provided';
    if (user.id === interaction.guild.me.id) {
      return interaction.reply({
        content: `Don't ban me with my own powers!`,
        ephemeral: true,
      });
    } else if (!target.bannable) {
      return interaction.reply({
        content: `I don't have permission to ban \`${user.tag}\``,
        ephemeral: true,
      });
    }

    const sentBy = interaction.member.user.username + '#' + interaction.member.user.discriminator;
    await target
      .send({
        embeds: [
          {
            title: `You have been banned from \`${interaction.guild.name}\``,
            fields: [
              { name: 'Reason', value: `\`${reason}\`` },
              { name: 'Banned By', value: `\`${sentBy}\`` },
            ],
            thumbnail: { url: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
            color: `#FF0000`,
            footer: {
              text: `Banned from ${interaction.guild.name}! `,
              iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
            },
          },
        ],
      })
      .catch((error) => {});

    await target.ban({
      reason: reason,
    });

    await interaction.reply({
      embeds: [
        {
          title: `\`${target.user.tag}\` has been banned!`,
          fields: [
            { name: 'Reason', value: `\`${reason}\`` },
            { name: 'Banned By', value: `\`${sentBy}\`` },
          ],
          thumbnail: { url: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
          color: `#FF0000`,
        },
      ],
    })
  },
};
