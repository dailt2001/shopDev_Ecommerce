import amqp from 'amqplib'

async function consumerOrderedMessage() {
    const connection = await amqp.connect("amqp://guest:123456@localhost");
    const channel = await connection.createChannel();
    const queueName = "ordered-queue-message"
    await channel.assertQueue(queueName, { durable: true })

    for (let i = 0; i < 10; i++) {
        const message = `ordered-queue-message:: ${i}`;
        console.log(message)
        channel.sendToQueue(queueName, Buffer.from(message),{ persistent: true })
    }

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
}

consumerOrderedMessage().catch(console.error);