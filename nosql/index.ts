import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import mongoose from "mongoose";
import cors from "cors";
import swaggerUI from "swagger-ui-express";

// Middleware
import ErrorHandler from "./middlewares/ErrorHandler";
import limiter from "./middlewares/rateLimit";

import swaggerJsDocs from "./documentation";
import IndexRouter from "./routes/index";
import { request } from "http";
import { string } from "zod";
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
  
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      PORT: string;
      NODE_ENV: string;
      OTP_SECRET: string;
      OTP_DURATION: number;
      SALT_ROUND:number
    }
  }
}
export const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDocs, { explorer: true })
);

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
