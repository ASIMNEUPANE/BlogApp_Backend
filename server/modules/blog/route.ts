import express, { NextFunction, Request, Response, Router } from 'express';
import controller from './controller';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await controller.create(req.body);
        res.status(200).json({ data: result, msg: 'Success' });
    } catch (e) {
        next(e);
    }
});

export default router;
