import { Client, Collection,MessageEmbedOptions, MessageEmbed, Message } from 'discord.js';
import { connect } from 'mongoose';
import path from 'path';
import { readdirSync } from 'fs';
import { Command, Config } from '../Interfaces';
import ConfigJson from '../config.json';
import dotenv from 'dotenv';
dotenv.config();

class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public events: Collection<string, Command> = new Collection();
  public cooldowns: Collection<string, Collection<string, number>> = new Collection();
  public categories: Set<string> = new Set();
  public config: Config = ConfigJson;
  public aliases: Collection<string, Command> = new Collection();
  public embed(options: MessageEmbedOptions, message: Message): MessageEmbedOptions {
    return new MessageEmbed({ ...options }).setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL()).setTimestamp();
  }
  private async OpenConnection() {
    /* Connect to MongoDB  */
    connect(process.env.DB_CONNECT,{
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

  private async CommandHandler(){
    const commandPath = path.join(__dirname, '..', 'commands');
    readdirSync(commandPath).forEach((dir) => {
      const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'));
  
      for (const file of commands) {
        const { command } = require(`${commandPath}/${dir}/${file}`);
        this.commands.set(command.name, command);
        this.categories.add(command.category);
        if (command?.aliases.length !== 0) {
          command.aliases.forEach((alias: any) => {
            this.aliases.set(alias, command);
          });
        }
      }
    });
  }

  private async EventHandler(){
    const eventPath = path.join(__dirname, '..', 'events');
    readdirSync(eventPath).forEach(async (file) => {
      const { event } = await import(`${eventPath}/${file}`);
      this.events.set(event.name, event);
      this.on(event.name, event.run.bind(null, this));
    });
  }
  private async InitHandlers(){
    this.EventHandler();
    this.CommandHandler();
  }

  public async init() {
    this.login(process.env.TOKEN); // Login to Discord
    this.OpenConnection(); // Open connection to MongoDB
    this.InitHandlers(); // Initialize Command and Event handlers
  }
}

export default ExtendedClient;
