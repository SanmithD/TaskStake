import express from 'express';
import { addTask, deleteTask, getMyTasks, getTaskById, updateTask, updateTaskStatus } from '../controllers/task.controller.js';
import { isAuthorized } from '../middlewares/administer.middleware.js';

const taskRouter = express.Router();

taskRouter.post("/add", isAuthorized, addTask);
taskRouter.get("/get", isAuthorized, getMyTasks);
taskRouter.get("/get/:id", isAuthorized, getTaskById);
taskRouter.put("/update/:id", isAuthorized, updateTask);
taskRouter.delete("/delete/:id", isAuthorized, deleteTask);
taskRouter.patch("/update/:id/status", isAuthorized, updateTaskStatus);

export default taskRouter;