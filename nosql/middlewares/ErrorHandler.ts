import { NextFunction, Request, Response } from "express";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware Error Handling");
  const errStatus = err.statusCode || 500;

  let errType;
  if (err.errors?.length) errType = "ZOD";
  else errType = "MONGO";

  console.log({ errType });

  let errMsg;
  if (errType === "ZOD") errMsg = err.errors[0].message;
  else {
    console.log("====xxxx", err, err.toJSON());
    errMsg = err.toJSON().message;
  }
  // console.log("====", err.toJSON().message, "===");

  // console.log(err,'zod')
  // let errMsg =''
  // console.log(err.message,'e')

  // if(err.errors){
  //   errMsg=err.errors[0].message
  // }
  // else{
  //   errMsg=err.error
  // }
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
