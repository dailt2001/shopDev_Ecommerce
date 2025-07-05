import redis from "redis";

class RedisPubSubService {
    constructor() {
        this.subscriber = redis.createClient({ url: "redis://localhost:6379" });
        this.publisher = redis.createClient({ url: "redis://localhost:6379" });

        this.subscriber.connect();
        this.publisher.connect();
    }

    async publish(channel, message) {
        try {
            const result = await this.publisher.publish(channel, message);
            console.log(`Published message to ${channel}:`, result);
            return result; // result là số subscriber nhận được message
        } catch (error) {
            console.error("Error when publishing message:", error);
        }
    }
    async subscribe(channel, callback) {
        await this.subscriber.subscribe(channel, (message) => {
            console.log(`Received message from ${channel}:`, message);
            callback(channel, message);
        });
    }
}

export default new RedisPubSubService();
