import express, { NextFunction, Request, Response, Router } from "express";
import controllor from "./auth.controller"
import {authValidatorMiddleware,verifyAuthMiddleware} from './auth.validator'
const router: Router = express.Router();

router.post("/register",authValidatorMiddleware, async(req:Request,res:Response,next:NextFunction)=>{
    try{
      console.log(req.body)
        const result = await controllor.register(req.body)
        res.status(200).json({data:result, msg:"success"})
    }catch(e){
      next(e)
    }
})
router.post("/verify",verifyAuthMiddleware, async(req:Request,res:Response,next:NextFunction)=>{
    try{
      console.log(req.body)
        const result = await controllor.verify(req.body)
        res.status(200).json({data:result, msg:"success"})
    }catch(e){
      next(e)
    }
})

export default router