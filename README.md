# <p align="center">🤖 Welcome to RogerBot! 🤖</p>
<p dir="auto" align="center">
  <a href="#about">About</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#Features">Features</a>
  •
  <a href="#Contributing">Contributing</a>
  •
  <a href="#license">License</a>
</p>

## <p id="about"> ✍️About </p>
**RogerBot** was created with <code><b>Discord.js</b></code> and <code><b>Typescript</b></code> and is still in early Development!  
This project started as a fun way to learn **Typescript** during my freetime and is something I'm really passionate about.   
**Roger** is an open source discord bot that is constantly growing. His codebase comes with a framework that is easy to implement new **Legacy** and **Slash** **Commands** with an already built in permission sytem for both types of commands and a cooldown system 
(currently implemented only for legacy commands)  

You can invite him to your Discord Server via [this](https://discord.com/api/oauth2/authorize?client_id=863861449083453440&permissions=8&scope=bot%20applications.commands) link!  
If you liked this repository, feel free to leave a star ⭐ to help promote Roger!!

## <p id="features"> 📚 Features </p>
**Roger** is still in early development stages so it doesn't have that many commands compared to other bots  
The bot currently has 4 categories of commands for both Slash and Legacy: 
- Admin
- Moderation
- Fun
- Utility  
  
It has an easy to configure system with the <code>**/config**</code>. It uses Discord's dropdown menus to help you set
channels for different functions of the bot, like **Moderation**, **Welcome** and **Goodbye** channels for your server.
## <p id="installation"> ⚙️ Installation </p>


To Run this bot you will need the follwing things:
- [Node.js](https://nodejs.org/en/) <b>v16+</b>
- [Discord.js](https://discord.js.org/#/) <b>v13+</b>
- [MongoDB](https://www.mongodb.com/)  

**Important**: Make sure that your bot has the **applications.commands** application scope enabled, which can be found under the OAuth2 tap on the 
[developer portal](https://discord.com/developers/applications/)  


Run <code>npm install</code> in the bot directory and make sure you get no errors.

Create a <code>.env</code> file with the following secrets:  
- <code>TOKEN</code> <b>Discord Bot Token</b>
- <code>DB_CONNECT</code> <b>MongoDB Connection String</b>    

Inside the <code>config.json</code> in the src folder you will find the bot's default prefix and the name of the fields inside the DB according to the schemas inside the <code>Schemas</code> folder this way you don't have to setup anything inside mongo besides the connection string. 🙂

At the end run <code>npm start</code> and enjoy your experience! 


## <p id="Contributing">📰 Contributing</p>

Pull requests are welcome! For major changes please open an issue first to discuss what you like to change.


## <p id="#license">📜 License</p>
Released under the [GPL-2.0](https://choosealicense.com/licenses/gpl-2.0/) license
