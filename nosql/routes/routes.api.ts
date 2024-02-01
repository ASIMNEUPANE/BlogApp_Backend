import express, { Request, Response } from 'express';
const router = express.Router();
import blogRouter from '../modules/blog/route'

router.use('/blog',blogRouter);





export default router;