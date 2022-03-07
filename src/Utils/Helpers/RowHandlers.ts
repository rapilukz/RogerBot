import { SelectMenuInteraction, CacheType } from "discord.js";
import { GetChannels, GetLabel, GetRoles } from "./Functions";
import { SendoToDB } from "./MongoFunctions";
import GuildSchema from "../Schemas/Guild";
import { DBFields } from "../JSON/DBFields.json";
import WelcomeSchema from "../Schemas/Welcome";
import FarewellSchema from "../Schemas/Farewell";
import TwitchSchema from "../Schemas/Twitch";
import { Emojis } from '../../Utils/JSON/Emojis.json';

export const HandleAnnouncementType = async (interaction: SelectMenuInteraction<CacheType>) => {
    const AnnouncementField = DBFields.GuildSchema.AnnouncementType;
    const guildId = interaction.guildId;
    interaction.values.forEach(async (value) => {
      await SendoToDB(AnnouncementField, value, GuildSchema, guildId);
  
      interaction.reply({
        embeds: [
          {
            title: 'Announcement Type',
            description: `Announcement type set to \`${value}\``,
            color: 'GREEN',
            timestamp: new Date(),
            footer: {
              text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
              icon_url: interaction.user.avatarURL(),
            },
          },
        ],
        ephemeral: true,
      });
    });
  };

export const HandleWelcomeChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
    const options = await GetChannels(interaction, 'GUILD_TEXT');
    const guildId = interaction.guildId;
    interaction.values.forEach(async (value) => {
      //Value is the id of the channel
      const Label = GetLabel(options, value);
      const ChannelName = DBFields.WelcomeSchema.ChannelName;
      const ChannelID = DBFields.WelcomeSchema.ChannelID;
  
      await SendoToDB(ChannelID, value, WelcomeSchema, guildId);
      await SendoToDB(ChannelName, Label, WelcomeSchema, guildId);
  
      interaction.reply({
        embeds: [
          {
            title: 'Welcome Channel',
            description: `Welcome Channel set to \`${Label}\``,
            color: 'GREEN',
            timestamp: new Date(),
            footer: {
              text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
              icon_url: interaction.user.avatarURL(),
            },
          },
        ],
        ephemeral: true,
      });
    });
  };

export const HandleFarewellChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
    const options = await GetChannels(interaction, 'GUILD_TEXT');
    const guildId = interaction.guildId;
    interaction.values.forEach(async (value) => {
      const Label = GetLabel(options, value);
      //Send the ID and the Channel Name to the DB
  
      const ChannelName = DBFields.FarewellSchema.ChannelName;
      const ChannelID = DBFields.FarewellSchema.ChannelID;
  
      await SendoToDB(ChannelID, value, FarewellSchema, guildId);
      await SendoToDB(ChannelName, Label, FarewellSchema, guildId);
  
      interaction.reply({
        embeds: [
          {
            title: 'Goodbye Channel',
            description: `Goodbye Channel set to \`${Label}\``,
            color: 'GREEN',
            timestamp: new Date(),
            footer: {
              text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
              icon_url: interaction.user.avatarURL(),
            },
          },
        ],
        ephemeral: true,
      });
    });
  };
  

export const HandleDefaultRole = async (interaction: SelectMenuInteraction<CacheType>) => {
    const options = await GetRoles(interaction);
    const guildId = interaction.guildId;
    interaction.values.forEach(async (value) => {
      const Label = GetLabel(options, value);
  
      const RoleName = DBFields.GuildSchema.DefaultRoleName;
      const RoleID = DBFields.GuildSchema.DefaultRoleID;
      await SendoToDB(RoleID, value, GuildSchema, guildId);
      await SendoToDB(RoleName, Label, GuildSchema, guildId);
  
      interaction.reply({
        embeds: [
          {
            title: 'Default Role',
            description: `Default Role set to \`${Label}\``,
            color: 'GREEN',
            timestamp: new Date(),
            footer: {
              text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
              icon_url: interaction.user.avatarURL(),
            },
          },
        ],
        ephemeral: true,
      });
    });
  };

export const HandleTwitchNotifications = async (interaction: SelectMenuInteraction<CacheType>) => {
    const guildId = interaction.guildId;
    const DBField = DBFields.TwitchSchema.NotificationsEnabled;
    const TwitchIcon = interaction.client.emojis.cache.get(Emojis.TwitchBack);
    interaction.values.forEach(async (value) => {
      await SendoToDB(DBField, value, TwitchSchema, guildId);
      
      interaction.reply({
        embeds: [
          {
            title: `${TwitchIcon} Twitch Notifications`,
            fields: [
              {
                name: 'Notifications set to:',
                value: `${value == 'true' ? '✅ **Enabled**' : '❌ **Disabled**'}`,
              },
            ],
            thumbnail: {
              url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthisonlineworld.com%2Fwp-content%2Fuploads%2F2018%2F02%2Ftwitch-app-logo.jpg&f=1&nofb=1',
            },
            color: '#A077FF',
          },
        ],
        ephemeral: true,
      });
    });
  };

  export const HandleTwitchChannel = async (interaction: SelectMenuInteraction<CacheType>) => {
    const options = await GetChannels(interaction, 'GUILD_TEXT');
    const guildId = interaction.guildId;
    const TwitchIcon = interaction.client.emojis.cache.get(Emojis.TwitchBack);
    
    interaction.values.forEach(async (value) => {
      const Label = GetLabel(options, value);
      const ChannelName = DBFields.TwitchSchema.ChannelName;
      const ChannelID = DBFields.TwitchSchema.ChannelID;
  
      await SendoToDB(ChannelID, value, TwitchSchema, guildId);
      await SendoToDB(ChannelName, Label, TwitchSchema, guildId);

      interaction.reply({
        embeds: [
          {
            title: `${TwitchIcon} Twitch Notification Channel`,
            description: `Channel set to \`${Label}\` \n Use \`/twitch-add\` to follow a channel to the list`,
            color: 'GREEN',
            timestamp: new Date(),
            footer: {
              text: `Set By ${interaction.user.username}#${interaction.user.discriminator}`,
              icon_url: interaction.user.avatarURL(),
            },
          },
        ],
        ephemeral: true,
      })
    });
  };