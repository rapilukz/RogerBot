import { Schema, model } from "mongoose";

const RequiredString = {
    type: String,
    required: true
};

const PrefixSchema = new Schema({
    //Guild ID
    _id: RequiredString,
    prefix: RequiredString,
})

export default model('guild-prefixes', PrefixSchema);