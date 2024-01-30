import express, { NextFunction, Request, Response, Router } from 'express';
import controller from './controller';
import {z,ZodError} from 'zod';
const router: Router = express.Router();

const blogSchemaValidator = z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(1),
    author:z.string().min(1),
    totalWord:z.number().min(1),

})



router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
       const {title,content,totalWord}= blogSchemaValidator.parse(req.body);
        const result = await controller.create(req.body);
        res.status(200).json({ data: result, msg: 'Success' });
    } catch (error) {
        if(error instanceof ZodError){
            res.status(400).json({ error:"invalid data",details:error.errors})
        }else{
            next(error);
        }
       
    }
});

router.get("/",async (req:Request,res:Response,next:NextFunction) => {
    try{

    }catch{}
    
})

export default router;
