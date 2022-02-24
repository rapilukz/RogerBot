export enum TypesOfMessage {
    Text = 'text',
    Embed = 'embed',
    Banner = 'banner',
}
export type BotMessageType = `${TypesOfMessage}`;

export interface TwitchChannel{
    _id: string;
    status: string;
}

export interface Leaderboard {
    [name: string]: number;
}

export type Delay = 10000 | 20000 | 30000 | 60000 | 120000 | 180000 | 240000 | 300000 | 360000 | 600000 | 900000 | 1800000;