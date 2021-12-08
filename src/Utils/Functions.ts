import { Message, User } from 'discord.js';
import Client from '../Client';
import fetch from 'node-fetch';
import RoastEmbed from './Embeds/roast';

export const isNumber = (input: any): boolean => {
  return !isNaN(input);
}

export const GetInsult = async () => {
  const response = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json');
  const json = await response.json();
  return json.insult;
};

export const roast = async (user: User, client: Client, message: Message) => {
  const Insult = await GetInsult();
  const Delay = 2000;
  message.channel.send(`Finding a way to roast ${user}...`).then(async (msg) => {
    setTimeout(() => {
      message.channel.send({ embeds: [RoastEmbed(client, message, user, Insult)] });
      msg.delete();
    }, Delay);
  });
};
