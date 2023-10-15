import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "api-orders",
  brokers: ["kafka:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const producer = kafka.producer();