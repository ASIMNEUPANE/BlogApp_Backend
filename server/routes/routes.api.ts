import express, { Request, Response } from 'express';
const router = express.Router();
import blogRouter from '../modules/blog/route'

router.get('/',blogRouter);

router.get('/hi', (req: Request, res: Response) => {
    res.send('asim');
});



export default router;