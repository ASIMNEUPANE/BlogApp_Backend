import express, { Request, Response } from 'express';
const router = express.Router();
import blogRouter from '../modules/blog/blog.route'

router.use('/blogs',blogRouter);





export default router;