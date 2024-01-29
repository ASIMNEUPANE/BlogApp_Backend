import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/hi', (req: Request, res: Response) => {
    res.send('asim');
});



export default router;