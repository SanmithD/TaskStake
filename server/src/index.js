import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { dbConnect } from './config/db.config.js';
import userRouter from './routes/user.route.js';

dbConnect();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/auth', userRouter);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});