import express from 'express'
import ErrorHandler from '../middlewares/ErrorHandler';
import IndexRouter from '../routes/index'
function createServer(){
    const app = express();
    app.use(express.json())
    app.use(ErrorHandler);
    app.use("/", IndexRouter);

    return app
}

export default createServer