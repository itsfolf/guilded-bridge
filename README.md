# Guilded <-> Discord Bridge
##### This app will keep your messages in sync between Discord and Guilded

## ⭐ Features
+ Synchronizes all channels, separately.
+ Automatically creates and manages webhooks on both Discord and Guilded.
+ Translates message content such as emotes (WIP)

## 📥 Installation
You will need [Git](https://git-scm.com/downloads) and [NodeJS](https://nodejs.org) (LTS is recommended) installed.
1. Open a command prompt / terminal of your choice (e.g. CMD if you’re on Windows, or Terminal if you’re using Linux / macOS) 
2. In chronological order, type each of these commands into the same command prompt / terminal opened in Step 1:
   1. `git clone https://github.com/fuwwy/guilded-bridge`
   2. `cd guilded-bridge`
   3. `npm i`
   4. Open `config.json` in a text editor of your choice and alter the values based on the [Configuration](https://github.com/fuwwy/guilded-bridge#-Configuration) section.
 
## ⚡Running
1. Open a command prompt / terminal of your choice, like described in Step 1 of Installing.
2. In chronological order, type each of these commands into the same command prompt / terminal opened in Step 1:
   1. `cd guilded-bridge`
   2. `npm start`

## 📝 Configuration
```
{
    "discord": {
        "botToken": "Your discord bot token",
        "guildId": "Your discord guild ID",
        "defaultChannel": "The default channel to send messages in, when one can't be found."
    },
    "guilded": {
        "email": "Your guilded account email",
        "password": "Your guilded account password",
        "teamId": "Your guilded team id",
        "defaultChannel": "The default channel to send messages in, when one can't be found",
        "logTeamsOnStart": true // Log teams the account is in on start (Useful for finding IDs)
    }
}
```

## 🛠️️ Finding channel/team/guild IDs
You can find Guilded Channel IDs and pressing copy link, you'll get a link that ends with something along the lines of "channels/**e6b9270d-3bda-43ba-b21f-373ff782c59a**/chat". The part in bold is your channel ID.
For Team IDs, go into the Widget page in Server settings and copy the widget code, paste it in some text editor for convenience, and find the link that ends in "canvas_index.html?route=%2Fcanvas%2Fembed%2Fbadge%2F**0jb0dDOl**". The bold part is again your ID (careful not to include the %2F).
For Discord, just enable "Developer Mode" in Advanced setings, right click your channel/guild, and press copy id.