# <p align="center">🤖 Welcome to RogerBot 🤖</p>

<p align="center">
  <img alt="GitHub package.json version" src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white&style=flat-square">
  <img alt="License GPL 2.0" src="https://img.shields.io/github/license/rapilukz/RogerBot?color=informational&style=flat"  />
  <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/rapilukz/RogerBot?color=success&style=flat">
  <img alt="GitHub package.json version" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white&style=flat">
  <img alt="GitHub package.json version" src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white&style=flat">
</p>


## <p id="about"> ✍️About </p>
Roger is a multipurpose discord bot built on top of [discord.js](https://discord.js.org/#/), with the main focus being moderation but also having a Twitch integration.  
It uses the recently introduced <b>Slash commands</b> to create an easy to use interface inside discord to help you configure your server without the need to use an external dashboard to configure the basics off the bot for your server as: <b>Welcome Channel</b>, <b>Default Role</b>, <b>Farewell Channel</b> and much more, inside the bot you can use <code>/help</code> to let you know about everything roger can do!

## <p id="Invite"> ✉ Invite Roger </p>

If you want roger to be a part of your server use [this](https://discord.com/api/oauth2/authorize?client_id=863861449083453440&permissions=8&scope=bot%20applications.commands) link to invite him!  
Liking this repository? Feel free to leave a star ⭐ to help promote Roger!!

## <p id="installation"> ⚙️ Installation </p>

To Run this bot you will need the follwing things:
- [Node.js](https://nodejs.org/en/) <b>v16+</b>
- [Discord.js](https://discord.js.org/#/) <b>v13+</b>
- [MongoDB](https://www.mongodb.com/)  
- [Twitch Developer App](https://dev.twitch.tv/)

**Important**: Make sure that your bot has the **applications.commands** application scope enabled, which can be found under the OAuth2 tab on the 
[developer portal](https://discord.com/developers/applications/)  

Run <code>npm install</code> to install all the dependencies in the bot directory and make sure you get no errors.

Create a <code>.env</code> file with the following secrets:  
- <code>TOKEN</code> <b>Discord Bot Token</b>
- <code>BOT_ID</code> <b>Discord Bot Client ID</b>
- <code>DB_CONNECT</code> <b>MongoDB Connection String</b>
- <code>CLIENT_ID</code> <b>Twitch App Client ID</b>  
- <code>CLIENT_SECRET</code> <b>Twitch APP Client Secret</b>

In the <code>config.json</code> inside src folder you will find the bot's default prefix  
If you dont't want to use the Twitch Integration set the <code>"EnableTwitch": false</code>

At the end run <code>npm start</code> and enjoy your experience! 


## <p id="#license">📜 License</p>
Released under the [GPL-2.0](https://choosealicense.com/licenses/gpl-2.0/) license
