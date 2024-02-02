import { NextFunction, Request, Response } from "express";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware Error Handling");

  const errStatus = err.statusCode || 500;

  let errType = err.errors?.length ? "ZOD" : "MONGO";

  let errMsg = errType === "ZOD" ? err.errors[0].message : err.toJSON().message

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });

  
};

export default ErrorHandler;
