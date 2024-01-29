import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const PORT= parseInt(process.env.PORT || "3333");
import  IndexRouter  from './routes/index';

const DB_URL: string = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Blog';
mongoose.connect(DB_URL).then(() => {
    console.log("Database is connected");
})

const app = express();

app.use("/",IndexRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const errMsg = err ? err.toString() : "Something went wrong";
    res.status(500).json({ data: "", msg: errMsg });
  });


app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
})