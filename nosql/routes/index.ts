import express, { Request, Response, Router } from 'express';
import apiRouter from './routes.api';

const router: Router = express.Router();

router.get('/routes', (req: Request, res: Response) => {
    res.send('Hello world me and you');
});

router.use('/api/v1', apiRouter);

export default router;
