import { Client, CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { DBFields } from '../../Utils/JSON/DBFields.json';
import TwitchSchema from '../../Utils/Schemas/Twitch';
import { GetFromDB } from '../Helpers/MongoFunctions';
import { bold } from '@discordjs/builders';
import { TwitchChannel } from '../../Interfaces/Random';

dotenv.config();

class Twitch {
  private authToken: Promise<String>;
  private client_id = process.env.CLIENT_ID;
  private client_secret = process.env.CLIENT_SECRET;
  private Client: Client;
  public Delay: number = 60000; // 60 second delay
  public MaxFollowerChannels: number = 10;

  constructor(client: Client) {
    this.Client = client;
    this.authToken = this.getToken();
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
    const token = await this.authToken;

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

  public async CheckNotifications(interaction: CommandInteraction): Promise<boolean> {
    const Field = DBFields.TwitchSchema.NotificationsEnabled;
    const HasTwitch = await GetFromDB(Field, TwitchSchema, interaction.guildId, interaction.guild.name);

    if (!HasTwitch) {
      interaction.reply({
        content: `This server doesn't have Twitch notifications ${bold(
          'enabled!'
        )}\nPlease use \`/config-twitch\` to enable it. `,
        ephemeral: true,
      });
      return false;
    }

    return true;
  }

  public async AddChannel(interaction: CommandInteraction, channel: string) {
    const guildId = interaction.guildId;
    try {
      await TwitchSchema.updateOne(
        { _id: guildId },
        { $push:  { TwitchChannels: {
            $each: [{ _id: channel }],
            $slice: -this.MaxFollowerChannels,
        } } },
        { upsert: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async GetList(interaction: CommandInteraction) {
    const guildId = interaction.guildId;
    const field = DBFields.TwitchSchema.TwitchChannels;

    const TwitchChannels: any[] = await GetFromDB(field, TwitchSchema, guildId, interaction.guild.name);

    const List: any[] = [];
    TwitchChannels.map((channel: TwitchChannel) => {
        List.push(channel._id);
    });

    return List;
  }
}

export default Twitch;
