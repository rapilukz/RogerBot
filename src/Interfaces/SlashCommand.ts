import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface Run {
  (interaction: CommandInteraction);
}

export interface SlashCommand {
  category: string;
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  run: Run;
}
