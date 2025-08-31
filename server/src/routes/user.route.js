import express from 'express';
import { getProfile, login, logout, signup } from '../controllers/user.controller.js';
import { isAuthorized, loginMiddleware, signupMiddleware } from '../middlewares/administer.middleware.js';

const userRouter = express.Router();

userRouter.post('/signup', signupMiddleware, signup);
userRouter.post('/login', loginMiddleware, login);
userRouter.post('/logout', isAuthorized, logout);
userRouter.get('/profile', isAuthorized, getProfile);

export default userRouter;