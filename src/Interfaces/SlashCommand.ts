import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionResolvable } from 'discord.js';

export interface Run {
  (interaction: CommandInteraction);
}

export interface SlashCommand {
  category: string;
  userPermissions?: PermissionResolvable[];
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  run: Run;
}
