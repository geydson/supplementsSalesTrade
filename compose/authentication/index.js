import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from "./routes/api.js";

const corsOpts = {
  credentials: true,
  origin: "*",
  methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE", "PUT"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Accept",
    "Content-Type",
    "Origin",
    "Authorization",
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Date",
    "X-Api-Version",
  ],
};

const app = express();

// app.use((req, res, next) => {
//   // Qualquer endereço pode fazer requisição "*"
//   res.header("Access-Control-Allow-Credentials", "*");

//   res.header("Access-Control-Allow-Origin", "true");

//   // Tipos de método que a API aceita
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,OPTIONS,PATCH,DELETE,POST,PUT"
//   );

//   // Permitir o envio de dados para API
//   res.header(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
//   );

//   // Executar o cors
//   app.use(cors());

//   // Quando não houver erro deve continuar o processamento
//   next();
// });

mongoose
  .connect("mongodb://mongo:27017/SPLT_AUTH", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log("MongoDB is connected");
  })
  .catch(function (err) {
    console.log(err);
  });

// app.use(cors(corsOpts));

app.use(express.urlencoded({ extended: false }));

app.get("/ping", (request, response) => res.json({ pong: true }));

app.use(express.json());
app.use(apiRoutes);

app.listen(3335);
