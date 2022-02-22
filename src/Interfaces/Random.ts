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