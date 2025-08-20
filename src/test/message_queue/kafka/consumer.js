import { Kafka } from "kafkajs";
const kafka = new Kafka({ clientId: "my-app", brokers: ["192.168.100.234:9092"] });
const consumer = kafka.consumer({ groupId: "test-group-1" });
const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({ value: message.value.toString() });
        },
    });
};
runConsumer().catch(console.error);
