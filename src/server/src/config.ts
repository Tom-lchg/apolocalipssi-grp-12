import process from "process";

import dotenv from "dotenv";
dotenv.config({ path: "./src/server/.env" });

export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

export const PORT = process.env.PORT || 3001;
export const MONGO_URI = process.env.MONGO_URI!;

/**
 * Model utilisé pour les résumés et les points clés
 * https://huggingface.co/models?pipeline_tag=text-generation&sort=trending
 */
export const model = "mistralai/Magistral-Small-2506";

/**
 * Paramètres utilisés pour les résumés et les points clés
 */
export const parameters = {
  max_length: 3000,
  min_length: 30,
  do_sample: false,
};
