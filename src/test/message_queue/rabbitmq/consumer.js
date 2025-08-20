// receiver.js
import amqp from "amqplib";

const run = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:123456@localhost");
    const channel = await connection.createChannel();

    const queue = "test_queue";

    await channel.assertQueue(queue, { durable: true });

    console.log("👂 Waiting for messages...");

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log("📩 Received:", msg.content.toString());
        channel.ack(msg); // optional nếu bạn không muốn auto-ack
      }
    });
  } catch (error) {
    console.error("❌ Error in consumer:", error);
  }
};

run().catch(console.error);
