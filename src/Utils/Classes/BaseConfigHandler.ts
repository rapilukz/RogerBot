import { Model } from 'mongoose';
import WelcomeSchema from '../Schemas/Welcome';
import FarewellSchema from '../Schemas/Farewell';
import GuildSchema from '../Schemas/Guild';
import TwitchSchema from '../Schemas/Twitch';
import { Emojis } from '../Helpers/Emojis';
import {
  ColorResolvable,
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from 'discord.js';
import { GetChannelByID, GetChannels, GetRoleByID, GetRoles } from '../Helpers/Functions';
import { DBFields, GetFromDB } from '../Helpers/MongoFunctions';
import { BotMessageType, TypesOfMessage } from '../../Interfaces/Random';


//This class creates the select menus with the corresponding options and then they are handled by the SelectMenuHandler.ts class
class BaseConfigHandler {
  private interaction: CommandInteraction;
  private TextChannels: Promise<MessageSelectOptionData[]>;
  private guildId: string;
  private guildName: string;

  constructor(interaction: CommandInteraction) {
    this.interaction = interaction;
    this.TextChannels = GetChannels(this.interaction, 'GUILD_TEXT');
    this.guildId = this.interaction.guildId;
    this.guildName = this.interaction.guild.name;
  }

  private async ChannelHandler(customID: string, Schema: Model<any>, title: string, color: ColorResolvable = 'RANDOM') {
    const options = await this.TextChannels;
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId(customID).setOptions(options).setPlaceholder('Available Channels 📚')
    );

    const Field = DBFields.ChannelID;

    const ChannelID = await GetFromDB(Field, Schema, this.guildId, this.guildName);
    const CurrentChannel = await GetChannelByID(this.interaction, ChannelID);

    await this.SendChannelReply(row, title, CurrentChannel, color);
  }

  private async AnnouncementHandler() {
    const MessageTypes: BotMessageType[] = Object.values(TypesOfMessage); //Sets the value of the enum to an array
    const List: MessageSelectOptionData[] = [];
    const AnnouncementField = DBFields.AnnouncementType;

    const CurrentType = await GetFromDB(AnnouncementField, GuildSchema, this.guildId, this.guildName);

    MessageTypes.forEach((type) => {
      List.push({
        label: type,
        value: type,
      });
    });

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId('AnnouncementType').setPlaceholder('Available Types 📚').addOptions(List)
    );

    this.interaction.reply({
      components: [row],
      embeds: [
        {
          title: '📚 Announcement Type',
          description: `Current Announcement Type: \`${CurrentType == null ? 'None' : CurrentType}\``,
          color: 'RANDOM',
        },
      ],
      ephemeral: true,
    });
  }

  private async RoleHandler() {
    const ListOfRoles = await GetRoles(this.interaction);
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId('Role').setPlaceholder('Available Roles 📚').addOptions(ListOfRoles)
    );

    const RoleField = DBFields.DefaultRoleID;

    const RoleID = await GetFromDB(RoleField, GuildSchema, this.guildId, this.guildName);
    const RoleName = await GetRoleByID(this.interaction, RoleID);

    await this.interaction.reply({
      components: [row],
      embeds: [
        {
          title: '📚 Default Role',
          description: `Default Role: \`${RoleName == null ? 'None' : RoleName}\``,
          color: 'RANDOM',
        },
      ],
      ephemeral: true,
    });
  }

  private async BooleanHandler(
    customID: string,
    Schema: Model<any>,
    DBField: keyof typeof DBFields,
    title: string,
    color: ColorResolvable = 'RANDOM'
  ) {
    const options: MessageSelectOptionData[] = [
      { label: 'Enable', value: 'true', emoji: '✅' },
      { label: 'Disable', value: 'false', emoji: '❌' },
    ];

    const CurrentState = await GetFromDB(DBField, Schema, this.guildId, this.guildName);
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu().setCustomId(customID).setPlaceholder('Enable/Disable').addOptions(options)
    );

    this.interaction.reply({
      components: [row],
      embeds: [
        {
          title,
          fields: [
            {
              name: 'Current State:',
              value: `${CurrentState == null ? '❌ **Disabled**' : ' ✅ **Enabled**'}`,
            },
          ],
          color,
        },
      ],
      ephemeral: true,
    });
  }

  private async SendChannelReply(row: MessageActionRow, title: string, CurrentChannel: string, color: ColorResolvable) {
    await this.interaction.reply({
      components: [row],
      embeds: [
        {
          title,
          description: `Current Channel: \`${CurrentChannel == null ? 'None' : CurrentChannel}\``,
          color,
        },
      ],
      ephemeral: true,
    });
  }

  public async ExecuteHandlers(value: any) {
    const Handlers = {
      Welcome: async () => {
        await this.ChannelHandler('WelcomeChannel', WelcomeSchema, '👋 Current Channel');
      },
      Farewell: async () => {
        await this.ChannelHandler('FarewellChannel', FarewellSchema, '😢 Farewell Channel');
      },
      TwitchChannel: async () => {
        const TwitchIcon = this.interaction.client.emojis.cache.get(Emojis.TwitchBack);
        await this.ChannelHandler('TwitchChannel', TwitchSchema, `${TwitchIcon} Twitch Channel`, '#A077FF');
      },
      EnableTwitchNotifications: async () => {
        const TwitchIcon = this.interaction.client.emojis.cache.get(Emojis.TwitchBack);
        await this.BooleanHandler(
          'TwitchNotifications',
          TwitchSchema,
          'NotificationsEnabled',
          `${TwitchIcon} Enable Twitch Notifications`,
          '#A077FF'
        );
      },
      Announcement: async () => {
        await this.AnnouncementHandler();
      },
      Role: async () => {
        await this.RoleHandler();
      },
      Default: async () => {
        this.interaction.reply({ content: `This menu is not implemented.`, ephemeral: true });
      },
    };

    if (Handlers[value]) {
      await Handlers[value]();
    } else {
      await Handlers.Default(); //If the value is not found, it will default to this
    }
  }
}

export default BaseConfigHandler;
