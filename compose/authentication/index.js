import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from "./routes/api.js";

const app = express();

mongoose
  .connect("mongodb://mongo:27017/SUPPLEMENTSSALESTRADE", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    console.log("MongoDB is connected");
  })
  .catch(function (err) {
    console.log(err);
  });

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.urlencoded({ extended: false }));

app.get("/ping", (request, response) => res.json({ pong: true }));

app.use(express.json());
app.use(apiRoutes);

app.listen(3335);
