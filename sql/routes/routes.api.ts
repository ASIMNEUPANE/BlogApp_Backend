import express, { Request, Response } from 'express';
const router = express.Router();
// import blogRouter from '../modules/blog/blog.route'
import authRouter from '../modules/auth/auth.routes'
import userRouter from '../modules/users/user.routes'

// router.use('/blogs',blogRouter);
router.use('/auths',authRouter);
router.use('/users',userRouter);





export default router;