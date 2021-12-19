const Eris = require("eris");

class DiscordToGuildedBridge {
    constructor(bridge, settings) {
        this.bridge = bridge;
        this.settings = settings;
        this.client = new Eris(`Bot ${this.settings.botToken}`, {
            intents: [
                "guilds",
                "guildMessages"
            ]
        })

        this.client.on('ready', () => {
            console.log(`[Discord] Logged in as ${this.client.user.username}/${this.client.user.id}`);
            this.guild = this.client.guilds.get(this.settings.guildId);
            console.log(`[Discord] Forwarding to guild ${this.guild.name}`)
        })

        this.client.on("messageCreate", message => {
            this.translateToGuilded(message);
        })
    }

    async connect() {
        this.client.connect();
    }

    async translateToGuilded(message) {
        if (message.webhookID) return;

        this.bridge.guilded.sendToWebhook(message.channel, `<${message.author.username}>: ${message.content}`)
    }

    findEmoteByName(emoteName) {
        return this.guild.emojis.find(emoji => emoji.name == emoteName);
    }

    async sendToWebhook(gChannel, message) {
        let channel = this.guild.channels.filter(channel => channel.name == gChannel.name);
        if (channel.length > 1) {
            channel = channels.filter(channel => channel.parentID && 
                this.guild.channels.get(channel.parentID).name == gChannel.categoryName);
        }
        channel = channel[0] || this.guild.channels.get(this.settings.mainChannel);

        const webhook = (await channel.getWebhooks()).find(w => w.application_id == this.client.user.id) || (await channel.createWebhook({
            name: "Guilded Bridge"
        }));

        this.client.executeWebhook(webhook.id, webhook.token, message);
    }
}

module.exports = DiscordToGuildedBridge