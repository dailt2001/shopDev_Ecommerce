import { Client, GatewayIntentBits } from "discord.js";

const { CHANNEL_ID_DISCORD, TOKEN_DISCORD } = process.env;

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.channelId = CHANNEL_ID_DISCORD;
        this.client.on("ready", () => {
            console.log(`Logged is as ${client.user.tag}`);
            this.client.login(TOKEN_DISCORD);
        });
    }

    sendToMessage(message = 'message'){
        const channel = this.client.channels.cache.get(this.channelId)
        if(!channel){
            console.error("Could not find the channel...", this.channelId)
        }
        channel.send(message).catch(err => console.error(err))
    }
}

const loggerService = new LoggerService();
export default loggerService;

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", () => {
    console.log(`Logged is as ${client.user.tag}`);
});

const token = "";
console.log("token", token);

client.on("error", (error) => console.error("Client error:", error));
client.on("shardError", (error) => console.error("Shard error:", error));
client.on("invalidated", () => console.error("Session invalidated"));
process.on("unhandledRejection", (error) => console.error("Unhandled promise rejection:", error));

client.login(token).catch((err) => console.error("Login failed:", err));

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    if (msg.content === "hello") {
        msg.reply("Hello! How can i assits you today!");
    }
});
