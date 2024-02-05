import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { rateLimit } from 'express-rate-limit'
import compression from "compression";
import mongoose from "mongoose";
import cors from "cors";
import IndexRouter from "./routes/index";

import ErrorHandler from "./middlewares/ErrorHandler";

const PORT = parseInt(process.env.PORT || "3333");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message:"Too many requests, please try again later."
})


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
app.use(limiter)

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

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
app.use("/", IndexRouter);

app.use(ErrorHandler)

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
