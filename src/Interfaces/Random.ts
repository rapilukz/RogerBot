export interface Choices {
    label: string;
    value: string;
}

enum TypesOfMessage {
    Text = 'text',
    Embed = 'embed',
    Banner = 'banner',
}
export interface BotMessageType {
    Type: TypesOfMessage;
}