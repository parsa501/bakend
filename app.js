import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { catchError, HandleERROR } from "vanta-api";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./Utils/Swagger.js";
import userRouter from "./Routes/User.js";
import messageRouter from "./Routes/Message.js";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.use(morgan("dev"));

// simple status route
app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

// routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 404 handler
app.use((req, res, next) => {
  return next(new HandleERROR("Not Found", 404));
});

// error handler
app.use(catchError);

export default app;
