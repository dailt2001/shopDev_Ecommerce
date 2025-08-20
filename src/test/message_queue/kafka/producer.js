import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "my-app", brokers: ["192.168.100.234:9092"] });
const producer = kafka.producer();

const runProducer = async () => {
    await producer.connect();
    await producer.send({ topic: "test-topic", messages: [{ value: "Hello KafkaJS user!" }] });
    await producer.disconnect();
};

runProducer().catch(console.error);
