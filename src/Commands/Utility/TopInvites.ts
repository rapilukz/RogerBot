import { Command } from '../../Interfaces';
import { Leaderboard } from '../../Interfaces/Random';
import { SEND_MESSAGES, CREATE_INSTANT_INVITE } from '../../Utils/Helpers/Permissions';
import LeaderboardEmbed from '../../Utils/Embeds/Random/TopInvite';

export const command: Command = {
  name: 'topinvites',
  aliases: ['ti', 'topinv', 'invleaderboard'],
  cooldown: 3,
  permissions: [SEND_MESSAGES, CREATE_INSTANT_INVITE],
  category: 'Utility',
  description: 'Test command',
  run: async (client, message, args) => {
    // Your code goes here
    if (!message.channel.isText()) return;
    const guild = message.guild;

    guild.invites.fetch().then(async (invites) => {
      const inviteCounter: Leaderboard = {};

      invites.forEach((invite) => {
        const { uses, inviter } = invite;
        const { tag } = inviter;
        const user = tag;
        inviteCounter[user] = (inviteCounter[user] || 0) + uses;
      });

      const sortedInvites = Object.keys(inviteCounter).sort((a, b) => inviteCounter[b] - inviteCounter[a]);
      let textTemplate = '';
      for (const invite of sortedInvites) {
        const counter = inviteCounter[invite];
        textTemplate += `\`${invite}\` - has **${counter}** invite(s)\n`;
      }

      // Podium System
      const emojiArray = ['🥇', '🥈', '🥉'];
      const FirstPlace = emojiArray[0] + textTemplate.split('\n')[0];
      const SecondPlace = emojiArray[1] + textTemplate.split('\n')[1];
      const ThirdPlace = emojiArray[2] + textTemplate.split('\n')[2];

      const Podium = [];
      switch (sortedInvites.length) {
        case 1:
          Podium.push(FirstPlace);
          break;
        case 2:
          Podium.push(FirstPlace, SecondPlace);
          break;
        case 3:
          Podium.push(FirstPlace, SecondPlace, ThirdPlace);
          break;
        default:
          Podium.push(FirstPlace, SecondPlace, ThirdPlace);
          break;
      }

      //Remove the first line of the text template
      for (let i = 0; i < Podium.length; i++) {
        textTemplate = textTemplate.replace(textTemplate.split('\n')[i], Podium[i]);
      }

      message.reply({ embeds: [LeaderboardEmbed(client, message, textTemplate)] });
    });
  },
};
