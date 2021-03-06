export enum TypesOfMessage {
  Text = 'text',
  Embed = 'embed',
  Banner = 'banner',
}
export type BotMessageType = `${TypesOfMessage}`;

export type ChannelType = 'GUILD_TEXT' | 'GUILD_VOICE' | 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STORE';

export interface TwitchChannel {
  _id: string;
  status: StreamStatus;
}

export interface Leaderboard {
  [name: string]: number;
}

export type Delay =
  | 10000
  | 20000
  | 30000
  | 60000
  | 120000
  | 180000
  | 240000
  | 300000
  | 360000
  | 600000
  | 900000
  | 1800000;

export type StreamStatus = 'live' | 'offline';

export interface StreamData {
  id: string;
  user_id: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export interface UserData{
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}
