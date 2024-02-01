import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import cors from 'cors';

import ErrorHandler from './middlewares/ErrorHandler';

const PORT= parseInt(process.env.PORT || "3333");
import  IndexRouter  from './routes/index';

const DB_URL: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Blog';
mongoose.connect(DB_URL).then(() => {
    console.log("Database is connected");
})

const app = express();
app.use(express.json())
app.use(cors());
app.use(express.static("public"))



app.use("/",IndexRouter);

  app.use(ErrorHandler)



app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
})






