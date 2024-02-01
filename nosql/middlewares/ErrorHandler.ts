import { NextFunction, Request, Response } from "express";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware Error Handling");
  const errStatus = err.statusCode || 500;
  console.log(err,'zod')
  let errMsg =''
  console.log(err.message,'e')

  if(err.errors){
    errMsg=err.errors[0].message
  }
  else{
    errMsg=err.error
  }
  // const errMsg = err.errors ? err.errors[0].message : err.message;
  console.log(errMsg, "errmssg");

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });

  // Don't call next() here to avoid unexpected behavior
  // next();
};

export default ErrorHandler;
