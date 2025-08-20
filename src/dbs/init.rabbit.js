import ampq from "amqplib";

export const connectRabbitMQ = async () => {
    try {
        const connection = await ampq.connect("amqp://guest:123456@localhost");
        if (!connection) throw new Error("Connection not established!");

        const channel = await connection.createChannel();
        return { channel, connection };
    } catch (error) {
        console.error("Error Connecting to RabbitMQ::", error);
    }
};

export const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectRabbitMQ();

        //Publish message to queue
        const queue = "test-queue";
        const message = "Hello, shopDev!";

        await channel.assertQueue(queue, {
            durable: true,
        });
        await channel.sendToQueue(queue, Buffer.from(message));

        //close connection
        await connection.close();
    } catch (error) {
        console.error("Error Connecting to RabbitMQ::", error);
    }
};

export const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true });

        console.log("👂 Waiting for messages...");

        channel.consume(queueName, (msg) => {
            if (msg !== null) {
                console.log("📩 Received:", msg.content.toString());
                // finding user  following that shop 
                // send message to user
                // send ok ==> success
                // send fail, message het ha, limited queue ==> dead letter queue
                channel.ack(msg); // optional nếu bạn không muốn auto-ack
            }
        });
    } catch (error) {
        console.error("❌ Error in consumer:", error);
    }
};
