import {
  Client,
  Collection,
  MessageEmbedOptions,
  MessageEmbed,
  Message,
  UserApplicationCommandData,
} from 'discord.js';
import { connect } from 'mongoose';
import path from 'path';
import { readdirSync } from 'fs';
import { Command, SlashCommand } from '../Interfaces';
import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import ascii from 'ascii-table';

dotenv.config();
let table = new ascii('Commands');
table.setHeading('Command', 'Loaded');

class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public SlashCommands: Collection<string, SlashCommand> = new Collection();
  public SlashCommandsArray: UserApplicationCommandData[] = [];
  public events: Collection<string, Command> = new Collection();
  public cooldowns: Collection<string, Collection<string, number>> = new Collection();
  public categories: Set<string> = new Set();
  public aliases: Collection<string, Command> = new Collection();
  public embed(options: MessageEmbedOptions, message: Message): MessageEmbedOptions {
    return new MessageEmbed({ ...options })
      .setFooter({ text: `Requested by ${message.author.tag} `, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
  }
  private async OpenConnection() {
    /* Connect to MongoDB  */
    connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
      .then(() => {
        console.log('Connected to MongoDB!');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private async CommandHandler() {
    const commandPath = path.join(__dirname, '..', 'commands');
    readdirSync(commandPath).forEach((dir) => {
      const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

      for (const file of commands) {
        const { command } = require(`${commandPath}/${dir}/${file}`);
        if (command.name) {
          this.commands.set(command.name, command);
          this.categories.add(command.category);
          table.addRow(file, '✅');
        } else {
          table.addRow(file, '❌');
          continue;
        }
        if (command?.aliases.length !== 0) {
          command.aliases.forEach((alias: any) => {
            this.aliases.set(alias, command);
          });
        }
      }
    });
  }

  private async SlashComamndHandler() {
    const GuildID = '700386156734578738';

    const SlashcommandPath = path.join(__dirname, '..', 'SlashCommands');
    readdirSync(SlashcommandPath).forEach((dir) => {
      const commands = readdirSync(`${SlashcommandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

      for (const file of commands) {
        const { command } = require(`${SlashcommandPath}/${dir}/${file}`);
        this.SlashCommands.set(command.data.name, command);
        this.SlashCommandsArray.push(command.data.toJSON());
      }
    });


    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(Routes.applicationCommands(process.env.BOT_ID), { body: this.SlashCommandsArray });

      console.log('Successfully reloaded application (/) commands.');
    } catch (err) {
      console.log(err);
    }
  }

  private async EventHandler() {
    const eventPath = path.join(__dirname, '..', 'events');
    readdirSync(eventPath).forEach(async (file) => {
      const { event } = await import(`${eventPath}/${file}`);
      this.events.set(event.name, event);
      this.on(event.name, event.run.bind(null, this));
    });
  }
  
  private async InitHandlers() {
    this.EventHandler();
    this.CommandHandler();
    this.SlashComamndHandler();
  }

  public async init() {
    this.login(process.env.TOKEN); // Login to Discord
    this.OpenConnection(); // Open connection to MongoDB
    this.InitHandlers(); // Initialize Command and Event handlers

   /*  console.log(table.toString()); */

  }
}

export default ExtendedClient;
