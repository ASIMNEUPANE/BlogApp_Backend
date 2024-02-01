import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import mongoose from "mongoose";
import cors from "cors";
import IndexRouter from "./routes/index";

import ErrorHandler from "./middlewares/ErrorHandler";

const PORT = parseInt(process.env.PORT || "3333");

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is not defined");
}
const DB_URL: string = process.env.DB_URL;
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use(compression());
app.use("/", IndexRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!".repeat(100000));
});
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
