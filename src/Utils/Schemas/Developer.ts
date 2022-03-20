import { Schema, model } from "mongoose";

const RequiredString = {
    type: String,
    required: true
};

const DevelopersSchema = new Schema({
    _id: RequiredString,
    Username: String,
})

export default model('Developers-Schemas', DevelopersSchema);