import { Schema, model } from "mongoose";

const RequiredString = {
    type: String,
    required: true
};

const GuildSchema = new Schema({
    //Guild ID
    _id: RequiredString,
    Guild: RequiredString,
    prefix: String,
   
    DefaultRoleID: String,
    AnnouncementType: {
        type: String,
        enum: ['embed', 'text', 'banner'],
        default: 'banner',
    },
    DefaultRoleName: String,
})

export default model('Guilds', GuildSchema);