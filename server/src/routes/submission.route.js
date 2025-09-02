import express from "express";
import { cancelTask, createSubmission, getMySubmissions } from "../controllers/submission.controller.js";
import { isAuthorized } from "../middlewares/administer.middleware.js";

const submissionRouter = express.Router();

submissionRouter.post("/create/:taskId", isAuthorized, createSubmission);
submissionRouter.get("/mine", isAuthorized, getMySubmissions);
submissionRouter.post("/cancel/:taskId", isAuthorized, cancelTask);
// submissionRouter.get("/all", getAllSubmissions); 

export default submissionRouter;
