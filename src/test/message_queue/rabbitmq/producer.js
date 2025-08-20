// sender.js
import amqp from "amqplib";

const run = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:123456@localhost");
    const channel = await connection.createChannel();

    const queue = "test_queue";
    const message = "Hello from RabbitMQ Producer!";

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));

    console.log("✅ Sent:", message);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("❌ Error in producer:", error);
  }
};

run().catch(console.error);
