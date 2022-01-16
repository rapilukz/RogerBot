import { Schema, model } from "mongoose";

const RequiredString = {
    type: String,
    required: true
};

const GuildSchema = new Schema({
    //Guild ID
    _id: RequiredString,
    Name: RequiredString,
    prefix: RequiredString,
})

export default model('Guilds', GuildSchema);