import "dotenv/config";
import { app } from "./app";
import { PORT } from "./config";
import summerizePdfRoute from "./routes/summerize/pdf";
import summerizeTextRoute from "./routes/summerize/text";

app.use("/summarize", summerizePdfRoute);
app.use("/summarize", summerizeTextRoute);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

export default app;
