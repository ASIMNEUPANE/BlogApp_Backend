import express, { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import controller from './controller';
import {z,ZodError} from 'zod';
import blogSchemaValidator from '../../utils/dataValidator';
const router: Router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/blog");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "." + file.originalname;
      cb(null, uniqueSuffix);
    },
  });
  
  const upload = multer({ storage: storage });

router.post("/",upload.single("images") ,async (req: Request, res: Response, next: NextFunction) => {
    try {
    console.log(req.file,'file')
    console.log(req.body,'body')
           const {title,content,totalWord,description,category,status,author,images,}= blogSchemaValidator.parse(req.body);
      req.body.images= req.file;
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
