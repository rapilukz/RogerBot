import { Schema, model } from "mongoose";

const RequiredString = {
    type: String,
    required: true
};

const GuildSchema = new Schema({
    //Guild ID
    _id: RequiredString,
    Name: String,
    prefix: String,
   
    WelcomeChannelID: String,
    WelcomeChannelName: String,
   
    GoodbyeChannelID: String,
    GoodbyeChannelName: String,

    DefaultRoleID: String,
    DefaultRoleName: String,
})

export default model('Guilds', GuildSchema);