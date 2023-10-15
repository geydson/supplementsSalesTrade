import express from "express";
import { Kafka, logLevel } from "kafkajs";
import mongoose from "mongoose";
import apiRoutes from "./routes/api.js";
import * as DashboardController from "./controllers/DashboardController.js";

const app = express();

const kafka = new Kafka({
  clientId: "api-dashboard",
  brokers: ["kafka:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

mongoose
  .connect("mongodb://mongo:27017/SPLT_DASHBOARD", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log("MongoDB is connected");
  })
  .catch(function (err) {
    console.log(err);
  });

app.use(express.urlencoded({ extended: false }));

app.get("/ping", (request, response) => res.json({ pong: true }));

app.use(express.json());

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "orders-dashboard-group-receiver" });

/**
 * Disponibiliza o producer para todas rotas
 */
app.use((req, res, next) => {
  req.producer = producer;

  return next();
});

/**
 * Cadastra as rotas da aplicação
 */
app.use(apiRoutes);

async function run(params) {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "data-dashboard" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const nDataReturn = await DashboardController.registerDashboard(
        JSON.parse(message.value)
      );
      console.log("Resposta", String(message.value));

      producer.send({
        topic: "orders-new-response",
        messages: [{ value: JSON.stringify(nDataReturn) }],
      });
    },
  });

  app.listen(3339);
}

run().catch(console.error);
