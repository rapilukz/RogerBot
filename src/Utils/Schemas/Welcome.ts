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

    Text: String, 
})

export default model('Welcome-Schemas', WelcomeSchema);