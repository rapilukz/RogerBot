import { CacheType, CommandInteraction, Message, SelectMenuInteraction } from 'discord.js';
import { Model } from 'mongoose';

/**
 * Sends the value to the desired field in the DB schema
 * @param {CollectionField} CollectionField - Field you want to send the value to
 * @param {any} Value - Value you want to send to the field
 * @param {string} guildId - the guild id
 * @param {Schema} Schema - the mongoose schema
 */
export const SendoToDB = async (CollectionField: string, value: any, Schema: Model<any>, guildId: string) => {
  try {
    await Schema.findOneAndUpdate({ _id: guildId }, { $set: { [CollectionField]: value } }, { upsert: true });
  } catch (error) {
    console.log(error);
  }
};

export const PushToDB = async (CollectionField: string, value: any, Schema: Model<any>, guildId: string) => {
   try{
     await Schema.updateOne({ _id: guildId }, { $push: { [CollectionField]: value } }, { upsert: true });
   }catch (error) {
     console.log(error);
   }
};

export const CreateSchema = async (Schema: Model<any, any, any>, guildId: string, guildName: string) => {
  await Schema.create({ _id: guildId, Guild: guildName });
};

/**
 * Gets the value of the specified field from the database
 * @param {CollectionField} CollectionField - Field to get from the database
 * @param {Schema} Schema - the mongoose schema
 * @param {string} guildId - the guild id
 * @param {string} guildName - the guild name
 */
export const GetFromDB = async (
  CollectionField: string,
  Schema: Model<any, any, any>,
  guildId: string,
  guildName: string
) => {
  try {
    const data = await Schema.findOne({ _id: guildId });
    if (!data) {
      await CreateSchema(Schema, guildId, guildName);
      return null;
    }

    if (!data[CollectionField]) return null;

    return data[CollectionField];
  } catch (err) {
    console.log(err);
  }
};
