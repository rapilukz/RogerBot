import { CacheType, CommandInteraction, Message, SelectMenuInteraction } from "discord.js";
import { Model } from "mongoose";

/**
 * Sends the value to the desired field in the DB schema
 * @param {CollectionField} CollectionField - Field you want to send the value to
 * @param {any} Value - Value you want to send to the field
 * @param {interaction} interaction - the type of interaction (Message | CommandInteraction | SelectMenuInteraction)
 * @param {Schema} Schema - the mongoose schema
 */
 export const SendoToDB = async (
    CollectionField: string,
    value: any,
    Schema: Model<any>,
    interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType>
  ) => {
    try {
      await Schema.findOneAndUpdate(
        { _id: interaction.guildId },
        { $set: { [CollectionField]: value, _id: interaction.guildId, Name: interaction.guild.name } },
        { upsert: true }
      );
    } catch {
      interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  };
  
  export const CreateSchema = async (
    interaction: CommandInteraction | Message | SelectMenuInteraction,
    Schema: Model<any, any, any>
  ) => {
    await Schema.create({ _id: interaction.guildId, Guild: interaction.guild.name });
  };
  
  /**
   * Gets the value of the specified field from the database
   * @param {CollectionField} CollectionField - Field to get from the database
   * @param {Schema} Schema - the mongoose schema
   * @param {interaction} interaction - the type of interaction (Message | CommandInteraction | SelectMenuInteraction)
   */
  export const GetFromDB = async (
    CollectionField: string,
    Schema: Model<any, any, any>,
    interaction: SelectMenuInteraction<CacheType> | CommandInteraction<CacheType> | Message
  ) => {
    try {
      const data = await Schema.findOne({ _id: interaction.guildId });
      if (!data) {
        await CreateSchema(interaction, Schema);
        return null;
      }
  
      if (!data[CollectionField]) return null;
  
      return data[CollectionField];
    } catch (err) {
      console.log(err);
    }
  };
  