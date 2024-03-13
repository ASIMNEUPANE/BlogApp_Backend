import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min/
  max: 100, //100 req allow for 15 min
  headers: true,
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    try {
      if (options.statusCode === 429) {
        throw new Error(options.message);
      }

      res.status(options.statusCode).json({
        status: "success",
        message: "Request accepted",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },
});

export default limiter;
