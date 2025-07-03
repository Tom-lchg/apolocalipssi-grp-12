import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app";
import { MONGO_URI, PORT } from "./config";
import authRoute from "./routes/auth";
import textRoute from "./routes/text";
import uploadRoute from "./routes/upload";

mongoose
  .connect(MONGO_URI!)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

app.use("/upload", uploadRoute);
app.use("/text", textRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

export default app;
