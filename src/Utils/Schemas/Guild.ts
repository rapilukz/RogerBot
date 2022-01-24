import { Schema, model } from "mongoose";

const RequiredString = {
    type: String,
    required: true
};

const GuildSchema = new Schema({
    //Guild ID
    _id: RequiredString,
    Guild: String,
    prefix: String,
   
    DefaultRoleID: String,
    DefaultRoleName: String,
})

export default model('Guilds', GuildSchema);