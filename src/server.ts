import express from "express";
import colors from "colors";
import morgan from "morgan";

import budgetRouter from "./routes/budgetRouter";
import authRouter from "./routes/authRouter";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/budget", budgetRouter);
app.use("/api/auth", authRouter);

app.use("/", (req, res) => {
  res.send("Ok");
});

export default app;
