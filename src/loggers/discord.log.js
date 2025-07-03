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
