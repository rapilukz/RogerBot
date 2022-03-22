import { CacheType, MessageEmbed, SelectMenuInteraction } from 'discord.js';
import { Model } from 'mongoose';
import { SendoToDB } from '../Helpers/MongoFunctions';
import { GetChannelByID, GetRoleByID } from '../Helpers/Functions';
import WelcomeSchema from '../Schemas/Welcome';
import FarewellSchema from '../Schemas/Farewell';
import GuildSchema from '../Schemas/Guild';
import TwitchSchema from '../Schemas/Twitch';
import { DBFields } from '../Helpers/MongoFunctions';


// This class is used to the value selected by the user in the select menu
class SelectMenuHandler {
  private interaction: SelectMenuInteraction<CacheType>;

  constructor(interaction: SelectMenuInteraction<CacheType>) {
    this.interaction = interaction;
  }

  private async ChannelHandler(HandlerName: string, Schema: Model<any>) {
    this.interaction.values.forEach(async (value) => {
      const ChannelName = await GetChannelByID(this.interaction, value);
      await SendoToDB(DBFields.ChannelID, value, Schema, this.interaction.guildId); // Update the DB with the new channel

      await this.SendEmbed(HandlerName, ChannelName);
    });
  }

  private async CustomHandler(HandlerName: string, Schema: Model<any>, DBField: keyof typeof DBFields) {
    this.interaction.values.forEach(async (value) => {
      let FieldValue: any;
      // Role ID needs a different logic but i don't want to create a new function for that because it's only used once
      if (DBField === DBFields.DefaultRoleID) {
        FieldValue = await GetRoleByID(this.interaction, value);
      } else {
        FieldValue = value;
      }

      await SendoToDB(DBField, value, Schema, this.interaction.guildId);
      await this.SendEmbed(HandlerName, FieldValue);
    });
  }

  private async CreateEmbed(HandlerName: string, FieldValue: string): Promise<MessageEmbed> {
    const embed = new MessageEmbed({
      title: `${HandlerName}`,
      description: `${HandlerName} was set to \`${FieldValue == null ? 'None' : FieldValue}\``,
      color: 'GREEN',
      timestamp: new Date(),
      footer: {
        text: `Set By ${this.interaction.user.username}#${this.interaction.user.discriminator}`,
        iconURL: this.interaction.user.avatarURL(),
      },
    });
    return embed;
  }

  private async SendEmbed(HandlerName: string, FieldValue: string) {
    const embed = await this.CreateEmbed(HandlerName, FieldValue);
    this.interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  public async ExecuteHandlers(customID: string) {
    const Handlers = {
      WelcomeChannel: async () => {
        await this.ChannelHandler('Welcome Channel', WelcomeSchema);
      },
      FarewellChannel: async () => {
        await this.ChannelHandler('Farewell Channel', FarewellSchema);
      },
      Role: async () => {
        await this.CustomHandler('Default Role', GuildSchema, 'DefaultRoleID');
      },
      AnnouncementType: async () => {
        await this.CustomHandler('Announcement Type', GuildSchema, 'AnnouncementType');
      },
      TwitchChannel: async () => {
        await this.ChannelHandler('Twitch Channel', TwitchSchema);
      },
      TwitchNotifications: async () => {
        await this.CustomHandler('Twitch Notification', TwitchSchema, 'NotificationsEnabled');
      },
      Default: async () => {
        this.interaction.reply({ content: `This menu is not implemented.`, ephemeral: true });
      },
    };


    if (Handlers[customID]) {
      await Handlers[customID]();
    } else {
      await Handlers.Default(); //If the value is not found, it will default to this
    }
  }
}

export default SelectMenuHandler;
