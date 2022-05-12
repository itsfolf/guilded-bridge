const { Client, WebhookClient } = require("@guildedjs/guilded.js");

class GuildedToDiscordBridge {
    constructor(bridge, settings) {
        this.bridge = bridge;
        this.settings = settings;
        this.client = new Client();

        this.client.on('ready', async () => {
            console.log(`[Guilded] Logged in as ${this.client.user.name}/${this.client.user.id}`);
            if (this.settings.logTeamsOnStart) console.log(`[Guilded] Teams: ${this.client.teams.cache.map(team => `${team.name}/${team.id}`).join(", ")}`)
            this.team =  this.client.teams.cache.get(this.settings.teamId);
            console.log(`[Guilded] Forwarding to team ${this.team.name}`)
        })

        this.client.on("messageCreate", message => {
            this.translateToDiscord(message);
        })
    }

    async connect() {
        this.client.login({
            email: this.settings.email,
            password: this.settings.password
        });
    }

    async fetchTeamCategories(team) {
        const x = await this.client.rest.get(`/teams/${team.id}/channels`);
        return x.categories.map(c => { return {name: c.name, id: c.id}; });
    }

    async getChannelWebhook(channel) {
        const allWebhooks = (await this.client.rest.get(`/teams/${channel.team.id}/members`)).webhooks;
        let webhook = allWebhooks.find(w => w.channelId == channel.id && w.name == "Discord Sync");
        if (!webhook) {
           const webhookData = await this.client.rest.post('/webhooks', {
               name: "Discord Sync",
               channelId: channel.id
           }, true);
           return webhookData;
        }
        const details = await this.client.rest.post(`/teams/${channel.team.id}/webhooks/detail`, {
            webhookIds: [webhook.id]
        });
        return { id: webhook.id, ...details[webhook.id] };
    }

    async translateToDiscord(message) {
        const discordMessage = {
            username: "",
            content: "",
            allowed_mentions: ["roles", "users"]
        };

        let author = message.author || (await message.client.users.fetch(message.authorID))
        if (author.name == 'Gil') return;

        discordMessage.username = author?.name || "Guilded Bridge";
        discordMessage.avatarURL = author?.avatarURLs?.small;
        
        message.parsedContent.parsedArr.forEach(element => {
            switch (element.type) {
                case 'text':
                    discordMessage.content += element.content;
                    break;
                case 'reaction':
                    if (element.reaction?.customReaction?.png) {
                        let emoji = this.bridge.discord.findEmoteByName(element.reaction.customReaction.name)
                        if (emoji) return discordMessage.content += `<:${emoji.name}:${emoji.id}>`
                    }
                    content += element.content;
                    break;
                case 'default':
                    console.log(element)
                    console.log(`[Guilded] I don't know how to translate ${element.type}, attempting to append content.`);
                    discordMessage.content += element.content;
                    break;
            }
        });

        this.bridge.discord.sendToWebhook({
            name: message.channel.name,
            categoryName: message.channel.channelCategoryID ? (await this.fetchTeamCategories(message.team)).find(c => c.id == message.channel.channelCategoryID)?.name : undefined
        }, discordMessage);
    }

    async sendToWebhook(dChannel, message) {
        let teamChannels = await this.team.fetchChannels();
        let channel = teamChannels.filter(channel => channel.name == dChannel.name);
        if (channel.size > 1) {
            let categories = await this.fetchTeamCategories(this.team);
            channel = channel.filter(channel => channel.channelCategoryID && 
                categories.find(c => c.id == channel.channelCategoryID)?.name == 
                this.bridge.discord.guild.channels.get(dChannel.parentID)?.name);
        }
        channel = channel.array()[0];
        if (!channel) {
            if (!this.settings.forwardToDefaultWhenNotFound) return;
            channel = teamChannels.get(this.settings.defaultChannel);
            message = message.replace(">", " @ #" + dChannel.name + ">");
        }
        const client = new WebhookClient(await this.getChannelWebhook(channel));
        client.send(message);
    }
}

module.exports = GuildedToDiscordBridge