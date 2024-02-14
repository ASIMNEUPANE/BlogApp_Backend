import { NextFunction, Request, Response } from "express";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware Error Handling");
  console.log(err)
  const errStatus = err.statusCode || 500;

  const errType = err.errors?.length ? "ZOD" : "ratelimit";

  // let errMsg = errType === "ZOD" ? err.errors[0].message : err.toJSON().message
  const errMsg = errType === "ZOD" ? err.errors[0].message : err.message;

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default ErrorHandler;
