import express from 'express';
import { sendMail } from '../controllers/contact.controller.js';
import { isAuthorized } from '../middlewares/administer.middleware.js';

const contactRouter = express.Router();

contactRouter.post('/send', isAuthorized, sendMail );

export default contactRouter;