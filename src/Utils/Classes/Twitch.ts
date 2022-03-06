import { Client, CommandInteraction, Guild } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { DBFields } from '../../Utils/JSON/DBFields.json';
import TwitchSchema from '../../Utils/Schemas/Twitch';
import { GetFromDB } from '../Helpers/MongoFunctions';
import { bold } from '@discordjs/builders';
import { ChannelList, TwitchChannel } from '../../Interfaces/Random';
import { Delay } from '../../Interfaces/Random';
import { connection } from 'mongoose';

dotenv.config();
class Twitch {
  private Token: Promise<String>;
  private client_id = process.env.CLIENT_ID;
  private client_secret = process.env.CLIENT_SECRET;
  private Client: Client;
  public Delay: Delay = 60000; // 60 second delay
  public MaxFollowedChannels: number = 10;

  constructor(client: Client) {
    this.Client = client;
    this.Token = this.getToken();
  }

  private async getToken(): Promise<string> {
    const url = process.env.GET_TOKEN_URL;
    const grant_type = 'client_credentials';

    const response = await axios.post(url, {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type,
    });

    return response.data.access_token;
  }

  public async getUsers(channel: string) {
    const url = process.env.GET_USERS_URL;
    const token = await this.Token;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-ID': this.client_id,
      },
      params: {
        login: channel,
      },
    });

    if (response.data.data.length === 0) return false;

    return response.data.data[0];
  }

  public async CheckNotifications(guildId: string, guildName: string): Promise<boolean> {
    const Field = DBFields.TwitchSchema.NotificationsEnabled;
    const HasTwitch = await GetFromDB(Field, TwitchSchema, guildId, guildName);

    if (!HasTwitch) return false;

    return true;
  }

  public async AddChannel(interaction: CommandInteraction, channel: string) {
    const guildId = interaction.guildId;
    try {
      await TwitchSchema.updateOne(
        { _id: guildId },
        {
          $push: {
            TwitchChannels: {
              $each: [{ _id: channel }],
              $slice: -this.MaxFollowedChannels,
            },
          },
        },
        { upsert: true }
      );
    } catch (error) {
      interaction.reply({ content: `Something went wrong, please try later!`, ephemeral: true });
      console.log(error);
    }
  }

  public async RemoveChannel(interaction: CommandInteraction, channel: string) {
    const guildId = interaction.guildId;
    try {
      await TwitchSchema.updateOne({ _id: guildId }, { $pull: { TwitchChannels: { _id: channel } } }, { upsert: true });
    } catch (error) {
      interaction.reply({ content: `Something went wrong, please try later!`, ephemeral: true });
      console.log(error);
    }
  }

  public async GetChannelsList(guildId: string, guildName: string): Promise<TwitchChannel[]> {
    const field = DBFields.TwitchSchema.TwitchChannels;

    const TwitchChannels: TwitchChannel[] = await GetFromDB(field, TwitchSchema, guildId, guildName);

    return TwitchChannels;
  }

  public async SendNotifications(guild: Guild) {
    const Field = DBFields.TwitchSchema.NotificationsEnabled;
    const guildId = guild.id;
    const guildName = guild.name;

    const HasTwitch = await GetFromDB(Field, TwitchSchema, guildId, guildName);
    if (!HasTwitch) return;

    const Channels: TwitchChannel[] = await this.GetChannelsList(guildId, guildName);
  }
}

export default Twitch;
