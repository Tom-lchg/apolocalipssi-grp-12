import "dotenv/config";
import { app } from "./app";
import { PORT } from "./config";
import authRoute from "./routes/auth";
import summerizePdfRoute from "./routes/summarize/pdf";
import summerizeTextRoute from "./routes/summarize/text";

app.use("/summarize", summerizePdfRoute);
app.use("/summarize", summerizeTextRoute);
app.use("/auth", authRoute);

app.listen(PORT);

export default app;
