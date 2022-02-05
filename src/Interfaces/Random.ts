import { EmojiResolvable } from "discord.js";

export interface Choices {
    label: string;
    value: string;
    emoji?: EmojiResolvable;
}

export enum TypesOfMessage {
    Text = 'text',
    Embed = 'embed',
    Banner = 'banner',
}
export type BotMessageType = `${TypesOfMessage}`;