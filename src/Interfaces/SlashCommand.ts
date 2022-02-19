import { SlashCommandBuilder } from '@discordjs/builders';
import Client from '../Client';
import { CommandInteraction, PermissionResolvable } from 'discord.js';

export interface Run {
  (interaction: CommandInteraction, client: Client);
}

export interface SlashCommand {
  category: string;
  userPermissions?: PermissionResolvable[];
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  run: Run;
}
