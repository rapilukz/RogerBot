import Client from "../Client";
import { Channel, Message } from "discord.js";

interface Run {
    (client: Client, message: Message, args: any[]);
}

export interface Command{
    name: string;
    aliases?: string[];
    category: string;
    cooldown: number;
    permissions?: any;
    description: string;
    run: Run;
}
