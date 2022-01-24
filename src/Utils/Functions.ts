import {
  CacheType,
  CommandInteraction,
  Message,
  MessageSelectOptionData,
  SelectMenuInteraction,
  User,
} from 'discord.js';
import Client from '../Client';
import fetch from 'node-fetch';
import RoastEmbed from './Embeds/Random/roast';
import GuildSchema from '../Utils/Schemas/Guild';
import { prefix as GlobalPrefix } from '../config.json';
import { Choices } from '../Interfaces/Random';
import { Model, Schema } from 'mongoose';

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

export const GetChannels = async (
  message: Message | CommandInteraction | SelectMenuInteraction<CacheType>,
  Type: 'GUILD_TEXT' | 'GUILD_VOICE' | 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STORE'
) => {
  const Channels = await message.guild.channels.fetch();
  const TextChannels: Choices[] = Channels.filter((channel) => channel.type == Type).map((channel) => {
    return {
      label: channel.name,
      value: channel.id,
    };
  });
  return TextChannels;
};

export const GetRoles = async (message: Message | CommandInteraction | SelectMenuInteraction<CacheType>) => {
  const roles = await message.guild.roles.fetch();
  const List: Choices[] = [];
  roles.map((role) => {
    if (role.name != '@everyone' && role.managed == false) {
      List.push({
        label: role.name,
        value: role.id,
      });
    }
  });

  //Orders the role list by name
  List.sort((a, b) => {
    if (a.label < b.label) return -1;
    if (a.label > b.label) return 1;
    return 0;
  });
  return List;
};

export const GuildPrefix = async (message: Message) => {
  const GuildID = message.guild.id;
  const GuildName = message.guild.name;

  const data = await GuildSchema.findOne({ _id: GuildID });

  if (!data) {
    await CreateSchema(message, GuildSchema);

    await GuildSchema.findOneAndUpdate({ _id: message.guildId }, { prefix: GlobalPrefix, Guild: GuildName }, { upsert: true });

    return GlobalPrefix;
  }

  const prefix = data.prefix;
  return prefix;
};

/**
 * Sends the value to the desired field in the DB schema
 * @param {CollectionField} CollectionField - Field you want to send the value to
 * @param {any} Value - Value you want to send to the field
 * @param {interaction} interaction - the type of interaction (Message | CommandInteraction | SelectMenuInteraction)
 * @param {Schema} Schema - the mongoose schema
 */
export const SendoToDB = async (
  CollectionField: string,
  value: any,
  Schema: Model<any>,
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>
) => {
  try {
    await Schema.findOneAndUpdate(
      { _id: interaction.guildId },
      { $set: { [CollectionField]: value, _id: interaction.guildId, Name: interaction.guild.name } },
      { upsert: true }
    );
  } catch {
    interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};

export const CreateSchema = async (
  interaction: CommandInteraction | Message | SelectMenuInteraction,
  Schema: Model<any, any, any>
) => {
  await Schema.create({ _id: interaction.guildId, Guild: interaction.guild.name });
};

/**
 * Gets the value of the specified field from the database
 * @param {CollectionField} CollectionField - Field to get from the database
 * @param {Schema} Schema - the mongoose schema
 * @param {interaction} interaction - the type of interaction (Message | CommandInteraction | SelectMenuInteraction)
 */
export const GetFromDB = async (
  CollectionField: string,
  Schema: Model<any, any, any>,
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType> | Message
) => {
  try {
    const data = await Schema.findOne({ _id: interaction.guildId });
    if (!data) {
      await CreateSchema(interaction, Schema);
      return null;
    }

    if (!data[CollectionField]) return null;

    return data[CollectionField];
  } catch (err) {
    console.log(err);
  }
};

export const GetLabel = (options: MessageSelectOptionData[] | MessageSelectOptionData[][], value: string) => {
  let label = '';
  options.forEach((option) => {
    if (option.value === value) {
      label = option.label;
    }
  });
  return label;
};
