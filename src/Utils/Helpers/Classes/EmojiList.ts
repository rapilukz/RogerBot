import { GuildEmoji, Snowflake } from 'discord.js';
import Client from '../../../Client/index'

type EmomjiID = Snowflake;
class EmojiList{
    public Youtube: EmomjiID = '944553666734612481' ;
    public Twitter: EmomjiID = '944553630374174720' ;
    public YTLive: EmomjiID = '944553659977580554' ;
    public TwitchBase: EmomjiID = '944553649609248779' ;
    public TwitchBack: EmomjiID = '944617845667553340';
    public TwitchLive: EmomjiID = '944553642260832277' ;

    public LogEmojis(client: Client): void{
        client.emojis.cache.forEach(emoji => {
            console.log(emoji.name + ' ' + emoji.id);
        });
    }

    public getEmoji(client: Client, emoji: EmomjiID): string{
        return client.emojis.cache.get(emoji).toString();
    }

    
}

export default EmojiList;