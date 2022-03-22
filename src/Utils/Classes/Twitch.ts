import { Client, CommandInteraction, Guild, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { DBFields } from '../Helpers/MongoFunctions';
import TwitchSchema from '../Schemas/Twitch';
import { GetFromDB } from '../Helpers/MongoFunctions';
import { StreamData, TwitchChannel, StreamStatus, UserData } from '../../Interfaces/Random';
import { Delay } from '../../Interfaces/Random';
import qs from 'qs';
import { bold } from '@discordjs/builders';

dotenv.config();
class Twitch {
  private Token: Promise<String>;
  private client_id = process.env.CLIENT_ID;
  private client_secret = process.env.CLIENT_SECRET;
  private Client: Client;
  public Delay: Delay = 60000; // 60 second delay
  public MaxFollowedChannels: number = 10;

  private GET_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
  private GET_USERS_URL = 'https://api.twitch.tv/helix/users';
  private GET_STREAMS_URL = 'https://api.twitch.tv/helix/streams';
  private GET_FOLLOWERS_URL = 'https://api.twitch.tv/helix/users/follows';

  constructor(client: Client) {
    this.Client = client;
    this.Token = this.GetToken();
  }

  private async GetToken(): Promise<string> {
    const url = this.GET_TOKEN_URL;
    const grant_type = 'client_credentials';

    const response = await axios.post(url, {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type,
    });

    return response.data.access_token;
  }

  public async GetFollowers(channelID: string): Promise<number> {
    const url = this.GET_FOLLOWERS_URL;
    const token = await this.Token;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-ID': this.client_id,
      },
      params: {
        to_id: channelID,
      },
    });

    return response.data.total;
  }

  public async GetUser(channel: string): Promise<UserData> {
    const url = this.GET_USERS_URL;
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

    if (response.data.data.length === 0) return;

    return response.data.data[0];
  }

  public async CheckNotifications(guildId: string, guildName: string): Promise<boolean> {
    const Field = DBFields.NotificationsEnabled;
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
      console.log(error);
    }
  }

  public async RemoveChannel(interaction: CommandInteraction, channel: string) {
    const guildId = interaction.guildId;
    try {
      await TwitchSchema.updateOne({ _id: guildId }, { $pull: { TwitchChannels: { _id: channel } } }, { upsert: true });
    } catch (error) {
      console.log(error);
    }
  }

  public async GetChannelsList(guildId: string, guildName: string): Promise<TwitchChannel[]> {
    const field = DBFields.TwitchChannels;

    const TwitchChannels: TwitchChannel[] = await GetFromDB(field, TwitchSchema, guildId, guildName);

    return TwitchChannels;
  }

  public async SendNotifications(guild: Guild) {
    const guildId = guild.id;
    const guildName = guild.name;

    const HasTwitch = await this.CheckNotifications(guildId, guildName);
    if (!HasTwitch) return;

    const ChannelsList: TwitchChannel[] = await this.GetChannelsList(guildId, guildName); // Get channels list from DB

    const ChannelNames: string[] = ChannelsList.map((channel) => channel._id);
    const StreamsInfo: StreamData[] = await this.GetChannelsInfo(ChannelNames); // makes request to twitch api to with the channel names from the array

    //find the streamer from ChannelNames that have no stream data
    ChannelsList.forEach((channel) => {
      const NoData = !StreamsInfo.find((stream) => stream.user_name === channel._id);
      if (NoData && channel.status == 'live') {
        this.UpdateChannelStatus(guildId, channel._id, 'offline');
      }
      return;
    });

    const Field = DBFields.ChannelID;
    const ChannelID = await GetFromDB(Field, TwitchSchema, guildId, guildName); // Get notifications channel ID from DB
    const Channel = this.Client.channels.cache.get(ChannelID) as any;

    StreamsInfo.forEach((stream) => {
      const WasOnline = ChannelsList.find((channel) => channel._id === stream.user_name && channel.status === 'live');
      if (WasOnline) return;
      console.log(`${stream.user_name} is live`);
      this.UpdateChannelStatus(guildId, stream.user_name, 'live');
      this.SendToChannel(stream, Channel);
    });
  }

  private async SendToChannel(streamData: StreamData, channel: any) {
    const streamerUrl = `https://twitch.tv/${streamData.user_name}`;
    const { profile_image_url } = await this.GetUser(streamData.user_name);

    const StreamerEmbed = new MessageEmbed({
      title: streamData.title,
      description: `[Watch Stream](${streamerUrl})`,
      author: {
        name: streamData.user_name + ' is now live on Twitch!',
        url: streamerUrl,
        iconURL: profile_image_url,
      },
      thumbnail: {
        url: profile_image_url,
      },
      url: streamerUrl,
      fields: [
        {
          name: `🎮 Playing:`,
          value: `${bold(streamData.game_name)}`,
          inline: true,
        },
        {
          name: `🌎 Language:`,
          value: `${bold(streamData.language.toUpperCase())}`,
          inline: true,
        },
      ],
      color: '#A077FF',
      image: {
        url: 'https://st1.bgr.in/wp-content/uploads/2020/09/Twitch-BGR-India.jpg',
      },
      footer: {
        text: `@Twitch`,
        iconURL: 'https://static.techspot.com/images2/downloads/topdownload/2021/04/2021-04-07-ts3_thumbs-373.png',
      },
      timestamp: new Date(),
    });
    channel.send({ content: `@everyone **${streamData.user_name} is now live!**`, embeds: [StreamerEmbed] });
  }

  private async GetChannelsInfo(channelParams: string[]): Promise<StreamData[]> {
    const url = this.GET_STREAMS_URL;
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

  private UpdateChannelStatus(guildId: string, channel_name: string, status: StreamStatus) {
    TwitchSchema.findOneAndUpdate(
      {
        _id: guildId,
        'TwitchChannels._id': channel_name,
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
