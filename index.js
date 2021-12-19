const fs = require('fs');
this.config = JSON.parse(fs.readFileSync(fs.existsSync('./config.prod.json') ? './config.prod.json' : './config.json'));

const DiscordToGuildedBridge = require('./discord');
const GuildedToDiscordBridge = require('./guilded');

this.discord = new DiscordToGuildedBridge(this, this.config.discord);
this.guilded = new GuildedToDiscordBridge(this, this.config.guilded);

this.discord.connect();
this.guilded.connect();