import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import mongoose from "mongoose";
import { MONGO_URI, corsOptions } from "./config";

export const app: Application = express();

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

mongoose
  .connect(MONGO_URI!)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));
