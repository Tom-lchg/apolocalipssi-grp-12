import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app";
import summerizePdfRoute from "./routes/summerize/pdf";
import summerizeTextRoute from "./routes/summerize/text";
import { MONGO_URI, PORT } from "./config";
import authRoute from "./routes/auth";

mongoose
  .connect(MONGO_URI!)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

mongoose
  .connect(MONGO_URI!)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

app.use("/summarize", summerizePdfRoute);
app.use("/summarize", summerizeTextRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

export default app;