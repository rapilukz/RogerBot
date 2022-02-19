import {
  AllowedImageSize,
  CacheType,
  CommandInteraction,
  GuildMember,
  Message,
  MessageAttachment,
  MessageSelectOptionData,
  SelectMenuInteraction,
  User,
} from 'discord.js';
import Client from '../../Client';
import fetch from 'node-fetch';
import RoastEmbed from '../Embeds/Random/roast';
import GuildSchema from '../Schemas/Guild';
import { prefix as GlobalPrefix } from '../../config.json';
import Canvas from 'canvas';
import path from 'path';
import { CreateSchema } from './MongoFunctions';

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
) : Promise<MessageSelectOptionData[]> => {
  const Channels = await message.guild.channels.fetch();
  const TextChannels: MessageSelectOptionData[] = Channels.filter((channel) => channel.type == Type).map((channel) => {
    return {
      label: channel.name,
      value: channel.id,
    };
  });

  TextChannels.push({
    label: 'None',
    value: 'None',
    emoji: '❌',	
  });

  return TextChannels;
};

export const GetRoles = async (message: Message | CommandInteraction | SelectMenuInteraction<CacheType>) : Promise<MessageSelectOptionData[]> => {
  const roles = await message.guild.roles.fetch();
  const List: MessageSelectOptionData[] = [];
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

  List.push({
    label: 'None',
    value: 'None',
    emoji: '❌',
  })

  return List;
};

export const GuildPrefix = async (message: Message) => {
  const GuildID = message.guild.id;
  const GuildName = message.guild.name;

  const data = await GuildSchema.findOne({ _id: GuildID });

  if (!data) {
    await CreateSchema(GuildSchema, GuildID, GuildName);

    await GuildSchema.findOneAndUpdate(
      { _id: message.guildId },
      { prefix: GlobalPrefix, Guild: GuildName },
      { upsert: true }
    );

    return GlobalPrefix;
  }

  const prefix = data.prefix;
  return prefix;
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

//Depression was inveted here 
export const CreateBanner = async (member: GuildMember) => {
  /* const Image = await GetFromDB() */

  const av = {
    size: 128 as AllowedImageSize, //258 
    x: 280,
    y: 15,
  }

  const dim = {
    height: 250,
    width: 700,
    margin: 180,
  }

  let username = member.user.username;
  let discriminator = member.user.discriminator;
  let avatar = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: av.size });
  const background = path.join(__dirname, '../../Content/background.png');
  
  const canvas = Canvas.createCanvas(dim.width, dim.height);
  const ctx = canvas.getContext('2d');
  //draws the background
  const backgroundImage = await Canvas.loadImage(background);
  ctx.drawImage(backgroundImage, 0, 0);

  //loads the avatar
  const avatarImage = await Canvas.loadImage(avatar);
  ctx.save();
  ctx.beginPath();
  ctx.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  //draws the avatar
  ctx.drawImage(avatarImage, av.x, av.y);
  ctx.restore();

  //write in text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  ctx.font = '26px sans-serif';
  ctx.fillText(`Welcome ${username}#${discriminator}!`, dim.width / 2, dim.margin);

  ctx.font = '26px sans-serif';
  ctx.fillText(`Member #${member.guild.memberCount}`, dim.width / 2, dim.margin + 35);


  const attachment = new MessageAttachment(canvas.toBuffer());

  return attachment;
};
