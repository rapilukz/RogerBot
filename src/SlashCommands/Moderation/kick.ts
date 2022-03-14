import { SlashCommand } from '../../Interfaces';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { KICK_MEMBERS } from '../../Utils/Helpers/Permissions';

export const command: SlashCommand = {
  category: 'Moderation',
  userPermissions: [KICK_MEMBERS],
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user from the server.')
    .addUserOption((option) => option.setName('user').setRequired(true).setDescription('The user to kick.'))
    .addStringOption((option) => option.setName('reason').setDescription('The reason for kicking the user.')),
  run: async (interaction: CommandInteraction) => {
    const user = interaction.options.getUser('user');
    let reason = interaction.options.getString('reason');
    const target = interaction.guild.members.cache.get(user.id);

    if (!reason) reason = 'No reason provided.';
    if (user.id === interaction.guild.me.id) {
      // If the user is trying to ban the bot
      return interaction.reply({
        content: `Don't try to ban me with my own powers!`,
        ephemeral: true,
      });
    } else if (!target.kickable) {
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
            title: `You have been kicked from \`${interaction.guild.name}\``,
            fields: [
              { name: 'Reason', value: `\`${reason}\`` },
              { name: 'Kicked By', value: `\`${sentBy}\`` },
            ],
            thumbnail: { url: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
            color: `#FF0000`,
            footer: {
              text: `Kicked from ${interaction.guild.name}! `,
              iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }),
            },
          },
        ],
      })
      .catch((error) => {});

    await target.kick();
    //TODO: Add the message to the mod log for now it's just a reply
    await interaction.reply({
      embeds: [
        {
          title: `\`${target.user.tag}\` has been kicked!`,
          fields: [
            { name: 'Reason', value: `\`${reason}\`` },
            { name: 'Kicked By', value: `\`${sentBy}\`` },
          ],
          thumbnail: { url: target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
          color: `#FF0000`,
        },
      ],
    });
  },
};
