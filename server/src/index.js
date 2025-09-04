import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import cron from "node-cron";
import { dbConnect } from './config/db.config.js';
import { autoFailExpiredTasks } from "./controllers/task.controller.js";
import contactRouter from './routes/contact.route.js';
import fundRouter from './routes/fund.route.js';
import submissionRouter from './routes/submission.route.js';
import taskRouter from './routes/task.route.js';
import userRouter from './routes/user.route.js';


dbConnect();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET','PUT',"POST","DELETE","OPTIONS","PATCH"]
}));
app.use(cookieParser());
app.use(bodyParser.json());

cron.schedule("0 * * * *", () => {
  autoFailExpiredTasks({}, { 
    status: () => ({ json: console.log }) 
  });
});

app.use('/api/auth', userRouter);
app.use('/api/task', taskRouter);
app.use('/api/fund', fundRouter);
app.use('/api/submission', submissionRouter);
app.use('/api/contact', contactRouter);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});