import "dotenv/config";
import { app } from "./app";
import { PORT } from "./config";
import summerizePdfRoute from "./routes/summarize/pdf";
import summerizeTextRoute from "./routes/summarize/text";
import authRoute from "./routes/auth";

app.use("/summarize", summerizePdfRoute);
app.use("/summarize", summerizeTextRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

export default app;
