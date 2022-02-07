import { Message, Collection } from 'discord.js';
import { Event } from '../Interfaces';
import { prefix as GlobalPrefix } from '../config.json';
import NoCommand from '../Utils/Embeds/Command/NoCommand';
import { GuildPrefix } from '../Utils/Helpers/Functions';

export const event: Event = {
  name: 'messageCreate',
  run: async (client, message: Message) => {
    // Custom Prefix check
    if (message.channel.type === 'DM') return;

    const prefix = await GuildPrefix(message);

    // Checks if the message starts with the Prefix
    if (!message.content.toLowerCase().startsWith(prefix + ' ') || message.author.bot || !message.guild) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();
    if (!cmd) return message.channel.send('No command provided');

    const command = client.commands.get(cmd) || client.aliases.get(cmd);
    if (!command) return NoCommand(client, message);
    // Cooldown System
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Collection());
    }

    const currentTime = Date.now();
    const timeStamps = client.cooldowns.get(command.name);
    const cooldownAmount = command.cooldown * 1000;

    if (timeStamps.has(message.author.id)) {
      const expirationTime = timeStamps.get(message.author.id) + cooldownAmount;

      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return message.channel.send(
          `Please wait **${timeLeft.toFixed(1)}s** before reusing the \`${command.name}\` command.`
        );
      }
    }

    timeStamps.set(message.author.id, currentTime);
    setTimeout(() => timeStamps.delete(message.author.id), cooldownAmount);

    if (command) {
      if (!message.member.permissions.has(command.permissions))
        return message.channel.send(`You do not have the required permissions to use this command.`);

      command.run(client, message, args);
    }
  },
};
