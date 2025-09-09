import express from 'express';
import { deleteAccount, getProfile, login, logout, signup, signupWithGoogle, updateProfile } from '../controllers/user.controller.js';
import { isAuthorized, loginMiddleware, signupMiddleware } from '../middlewares/administer.middleware.js';

const userRouter = express.Router();

userRouter.post('/signup', signupMiddleware, signup);
userRouter.post('/login', loginMiddleware, login);
userRouter.post('/google', signupWithGoogle);
userRouter.post('/logout', isAuthorized, logout);
userRouter.get('/profile', isAuthorized, getProfile);
userRouter.put('/update', isAuthorized, updateProfile);
userRouter.delete('/delete', isAuthorized, deleteAccount);

export default userRouter;