import { Schema, model } from 'mongoose';

const RequiredString = {
  type: String,
  required: true,
};

const TwitchSchema = new Schema({
  //Guild ID
  _id: RequiredString,
  Guild: RequiredString,

  NotificationsEnabled: {
    type: Boolean,
    default: false,
  },
  ChannelID: String,
  
  TwitchChannels: [
    {
      _id: String,
      status: {
        type: String,
        default: 'offline',
      }
    },
    
  ],

});

export default model('Twitch-Schemas', TwitchSchema);
