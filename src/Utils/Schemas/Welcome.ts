import { Schema, model } from "mongoose";

const RequiredString = {
    type: String,
    required: true
};

const WelcomeSchema = new Schema({
    //Guild ID
    _id: RequiredString,
    Guild: RequiredString,
   
    ChannelID: String,
    ChannelName: String,

    MessageType: {
        type: String,
        enum: ['embed', 'text', 'banner'],
        default: 'banner',
    },

    Text: String,
    Embed: JSON,   
})

export default model('Welcome-Schemas', WelcomeSchema);