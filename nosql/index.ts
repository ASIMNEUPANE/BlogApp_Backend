import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import limiter from "./middlewares/rateLimit";
import compression from "compression";
import mongoose from "mongoose";
import YAML from "yamljs";

import logger from "morgan";
import swaggerUI from "swagger-ui-express";

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

const swaggerJsDocs = YAML.load("./utils/api.yaml");
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(express.static("public"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

app.use(express.urlencoded({ extended: false }));

app.use(
  compression({
    filter: (req: Request, res: Response) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
app.use(limiter);
app.use("/", IndexRouter);
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
