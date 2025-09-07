import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { catchError, HandleERROR } from "vanta-api";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./Utils/Swagger.js";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res, next) => {
  res.send("Server is live");
});



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((req, res, next) => {
  return next(new HandleERROR("Not Found", 404));
});
app.use(catchError);
export default app;
