import { Command } from '../../Interfaces';
import { SEND_MESSAGES } from '../../Utils/Permissions';
import { Timer, EndTimer } from '../../Utils/Embeds/Random/Timer';
import ms from 'ms';
import { isNumber } from '../../Utils/Functions';

export const command: Command = {
  name: 'timer',
  aliases: ['time', 'settimer', 'settime', 'alarm', 'setalarm'],
  cooldown: 0,
  permissions: [SEND_MESSAGES],
  category: 'Utility',
  description: 'Set a timer for a message',
  run: async (client, message, args) => {
    // Your code goes here
    let time: ms = args[0];
    let MsTime = ms(time);
    if (!time) return message.reply('Please specify a time');
    if (isNumber(time)) return message.reply(`Please specify a time in a valid format \`(e.g. 1h | 1d | 1s)\``);
    if (MsTime > ms('1d')) return message.reply('Please specify a time under 1 day');

    let reason = args.slice(1).join(' ');
    if (!reason) return message.reply('Please specify a reason for the timer');

    // get the message from the author and delete it
    const msg = await message.channel.messages.fetch(message.id);
    await msg.delete();

    await message.channel
      .send({ embeds: [Timer(client, message, time, reason)] })
      .then(async (msg) => {
        setTimeout(() => {
          msg.delete();
          EndTimer(client, message, time, reason);
        }, MsTime);
      })
      .catch((err) => {
        console.log(err);
        message.channel.send(`something went wrong please try again later`);
      });
  },
};
