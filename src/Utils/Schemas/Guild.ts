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
   
    WelcomeChannelID: Number,
    WelcomeChannelName: String,
   
    GoodbyeChannelID: Number,
    GoodbyeChannelName: String,
    
    ModerationChannelID: Number,
})

export default model('Guilds', GuildSchema);