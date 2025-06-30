import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";

import { corsOptions } from "./config";

export const app: Application = express();

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
