import Client from '../Client';
import { Message, PermissionResolvable } from 'discord.js';

interface Run {
  (client: Client, message: Message, args: any[]);
}

export interface Command {
  name: string;
  aliases?: string[];
  category: string;
  cooldown: number;
  permissions?: PermissionResolvable[];
  description: string;
  run: Run;
}
