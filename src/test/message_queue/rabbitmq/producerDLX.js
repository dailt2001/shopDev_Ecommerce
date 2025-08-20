// sender.js
import amqp from "amqplib";

const run = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:123456@localhost");
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx' //notificationEx direct
    const notificationQueue = "notificationQueueProcess" //assertQueue
    const notificationExchangeDLX = "notificationExDLX" // notificationEx direct
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // assert
    //1. create exchange
    await channel.assertExchange(notificationExchange, 'direct', { durable: true })
    // 2. create queue
    const queueResult = await channel.assertQueue(notificationQueue, {exclusive: false, deadLetterExchange: notificationExchangeDLX, deadLetterRoutingKey: notificationRoutingKeyDLX })
    // 3.bindQueue 
    await channel.bindQueue(queueResult.queue, notificationExchange)
    // 4.create message
    const message = "A new product"
    await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
        expiration: '10000'
    })
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
