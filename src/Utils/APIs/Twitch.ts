import { Client, CommandInteraction, Guild } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { DBFields } from '../JSON/DBFields.json';
import TwitchSchema from '../Schemas/Twitch';
import { GetFromDB } from '../Helpers/MongoFunctions';
import { StreamData, TwitchChannel, StreamStatus } from '../../Interfaces/Random';
import { Delay } from '../../Interfaces/Random';
import qs from 'qs';

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

  public async getUser(channel: string) {
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
    const guildId = guild.id;
    const guildName = guild.name;

    const HasTwitch = await this.CheckNotifications(guildId, guildName);
    if (!HasTwitch) return;

    const Channels: TwitchChannel[] = await this.GetChannelsList(guildId, guildName); // Get channels list from DB

    const NotifcationsChannelID = DBFields.TwitchSchema.ChannelID;
    const NotificationsChannel = await GetFromDB(NotifcationsChannelID, TwitchSchema, guildId, guildName); // Get notifications channel ID from DB

    const ChannelNames: string[] = Channels.map((channel) => channel._id);
    const StreamsInfo: StreamData[] = await this.GetChannlesInfo(ChannelNames); // makes request to twitch api to with the channel names from the array

    //find the streamer from ChannelNames that have no stream data
    Channels.filter((channel) => {
      const NoData = !StreamsInfo.find((stream) => stream.user_name === channel._id);
      if (NoData && channel.status == 'live') {
        this.UpdateChannelStatus(guildId, channel._id, 'offline');
      }
      return;
    });

    /* StreamsInfo.forEach((stream) => {
      const CurrentStatus = 'live';

      console.log(`${stream.user_name} is online!`);
    }); */
  }

  private async GetChannlesInfo(channelParams: string[]): Promise<StreamData[]> {
    const url = process.env.GET_STREAMS_URL;
    const token = await this.Token;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-ID': this.client_id,
        },
        params: {
          user_login: channelParams,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  private UpdateChannelStatus(guildId: string, channel_id: string, status: StreamStatus) {
    TwitchSchema.findOneAndUpdate(
      {
        _id: guildId,
        'TwitchChannels._id': channel_id,
      },
      {
        $set: {
          'TwitchChannels.$.status': status,
        },
      },
      { upsert: true },
      (err, doc) => {
        if (err) console.log(err);
      }
    );
  }
}

export default Twitch;
