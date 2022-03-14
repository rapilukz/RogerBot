import { Schema, model } from "mongoose";

const RequiredString = {
    type: String,
    required: true
};

const FarewellSchema = new Schema({
    //Guild ID
    _id: RequiredString,
    Guild: RequiredString,
   
    ChannelID: String,
    ChannelName: String,
    
    Text: String,  
})

export default model('Farewell-Schemas', FarewellSchema);