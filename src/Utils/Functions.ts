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
    await CreateDB(message);
    return GlobalPrefix;
  }

  const prefix = data.prefix;
  return prefix;
};

export const SendoToDB = async (
  CollectionField: string,
  value: any,
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>
) => {
  try {
    await GuildSchema.findOneAndUpdate(
      { _id: interaction.guildId },
      { $set: { [CollectionField]: value } },
      { upsert: true }
    );
  } catch {
    interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};

export const CreateDB = async (interaction: CommandInteraction | Message | SelectMenuInteraction) => {
  await GuildSchema.create({ _id: interaction.guildId, Name: interaction.guild.name, prefix: GlobalPrefix });
};

export const GetFromDBInteraction = async (
  CollectionField: string,
  interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>
) => {
  try {
    const data = await GuildSchema.findOne({ _id: interaction.guildId });
    if (!data) {
      await CreateDB(interaction);
      return 'None';
    }

    if (!data[CollectionField]) return 'None';

    return data[CollectionField];
  } catch {
    interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};

export const GetFromDBMessage = async (CollectionField: string, message: Message) => {
  try {
    const data = await GuildSchema.findOne({ _id: message.guildId });
    if (!data) {
      await CreateDB(message);
      return null;
    }

    if (!data[CollectionField]) return null;

    return data[CollectionField];
  } catch {
    message.reply({ content: 'There was an error while executing this command!' });
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
