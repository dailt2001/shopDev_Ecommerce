import { connectRabbitMQ, consumerQueue } from "../dbs/init.rabbit.js";

class MessageService {
    static async consumerToQueue(queueName) {
        try {
            const { channel, connection } = await connectRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error("Error consumer to queue::", error);
        }
    }
    //case success processing
    static async consumerToQueueNormal() {
        try {
            const { channel, connection } = await connectRabbitMQ();
            const notificationQueue = "notificationQueueProcess";

            channel.consume(notificationQueue, (msg) => {
                if (msg !== null) {
                    console.log("📩 Received:", msg.content.toString());
                    channel.ack(msg);
                }
            });

            // 1. test expired TTL

            // setTimeout(() => {
            //     channel.consume(notificationQueue, (msg) => {
            //         if (msg) {
            //             console.log("📩 Normal Received:", msg.content.toString());
            //             channel.ack(msg);
            //         }
            //     });
            // }, 15000); // Delay 15s > TTL (10s)

            //2. test error code 

            // channel.consume(notificationQueue, (msg) => {
            //     try {
            //         const number = Math.random();
            //         console.log({ number });
            //         if (number < 0.8) {
            //             throw new Error("send fail");
            //         }
            //         if (msg) {
            //             console.log("📩 Normal Received:", msg.content.toString());
            //             channel.ack(msg);
            //         }
            //     } catch (error) {
            //         //console.error("Send error", error);
            //         channel.nack(msg, false, false)
            //     }
            // });
        } catch (error) {
            console.error("❌ Error in consumer:", error);
        }
    }
    //case fail processing
    static async consumerToQueueFail() {
        try {
            const { channel, connection } = await connectRabbitMQ();
            const notificationExchangeDLX = "notificationExDLX"; // notificationEx direct
            const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";
            const notificationQueueHandler = "notificationQueueHotFix";

            await channel.assertExchange(notificationExchangeDLX, "direct", { durable: true });
            const queueResult = await channel.assertQueue(notificationQueueHandler, { exclusive: false });
            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);

            channel.consume(queueResult.queue, (msg) => {
                if (msg !== null) {
                    console.log("📩 Received from notification hot fix:", msg.content.toString());
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error("❌ Error in consumer:", error);
        }
    }
}

export default MessageService;
