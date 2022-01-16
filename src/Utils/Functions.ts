import { Channel, CommandInteraction, Message, User } from 'discord.js';
import Client from '../Client';
import fetch from 'node-fetch';
import RoastEmbed from './Embeds/Random/roast';
import GuildSchema from '../Utils/Schemas/Guild';
import { prefix as GlobalPrefix } from '../config.json';
import { ChannelType } from 'discord-api-types';
import { ChannelTypes } from 'discord.js/typings/enums';

export const isNumber = (input: any): boolean => {
  return !isNaN(input);
};

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

export const GetChannels = async (message: Message | CommandInteraction, Type: "GUILD_TEXT" | "GUILD_VOICE" | "GUILD_CATEGORY" | "GUILD_NEWS" | "GUILD_STORE") => {
  const Channels = await message.guild.channels.fetch();
  const TextChannels = Channels.filter((channel) => channel.type == Type).map((channel) => {
    return {
      label: channel.name,
      value: channel.id,
    };
  });
  return TextChannels;
};

export const GuildPrefix = async (message: Message) => {
  const GuildID = message.guild.id;
  const GuildName = message.guild.name;

  const data = await GuildSchema.findOne({ _id: GuildID });

  if (!data) await GuildSchema.create({ _id: GuildID, Name: GuildName , prefix: GlobalPrefix });
  let prefix = data.prefix ? data.prefix : GlobalPrefix;

  return prefix;
}

