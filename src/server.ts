import express from "express";
import morgan from "morgan";
import cors from "cors";

import budgetRouter from "./routes/budgetRouter";
import authRouter from "./routes/authRouter";
import { corsConfig } from "./config/cors";

const app = express();

app.use(morgan("dev"));

// request config
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// cors
app.use(cors(corsConfig));

// routes
app.use("/api/budget", budgetRouter);
app.use("/api/auth", authRouter);

export default app;
