import { CacheType, MessageEmbed, SelectMenuInteraction } from 'discord.js';
import { Model } from 'mongoose';
import { SendoToDB } from './MongoFunctions';
import { GetChannelByID, GetRoleByID } from './Functions';

class RowHandlers {
  private interaction: SelectMenuInteraction<CacheType>;

  constructor(interaction: SelectMenuInteraction<CacheType>) {
    this.interaction = interaction;
  }

  public async ChannelHandler(HandlerName: string, Schema: Model<any>) {
    this.interaction.values.forEach(async (value) => {
      const ChannelName = await GetChannelByID(this.interaction, value);
      await SendoToDB('ChannelID', value, Schema, this.interaction.guildId);

      await this.SendEmbed(HandlerName, ChannelName);
    });
  }

  public async CustomHandler(HandlerName: string, Schema: Model<any>, DBField: string){
    this.interaction.values.forEach(async (value) => {
      // Role ID needs a different logic but i don't want to create a new function for that because it's only used once
      if(DBField === 'DefaultRoleID'){
        const RoleName = await GetRoleByID(this.interaction, value);
        await SendoToDB(DBField, value, Schema, this.interaction.guildId);
        await this.SendEmbed(HandlerName, RoleName);
      }

      await SendoToDB(DBField, value, Schema, this.interaction.guildId);
      await this.SendEmbed(HandlerName, value);
   
    });
  }

  private async CreateEmbed(HandlerName: string, ObjectName: string): Promise<MessageEmbed> {
    const embed = new MessageEmbed({
      title: `${HandlerName}`,
      description: `${HandlerName} was set to \`${ObjectName == null ? 'None' : ObjectName}\``,
      color: 'GREEN',
      timestamp: new Date(),
      footer: {
        text: `Set By ${this.interaction.user.username}#${this.interaction.user.discriminator}`,
        iconURL: this.interaction.user.avatarURL(),
      },
    });
    return embed;
  }
  
  private async SendEmbed(HandlerName: string, ObjectName: string) {
    const embed = await this.CreateEmbed(HandlerName, ObjectName);
    this.interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
}

export default RowHandlers;
