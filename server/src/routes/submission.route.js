import express from "express";
import { createSubmission, getMySubmissions } from "../controllers/submission.controller.js";
import { isAuthorized } from "../middlewares/administer.middleware.js";

const submissionRouter = express.Router();

submissionRouter.post("/create", isAuthorized, createSubmission);
submissionRouter.get("/mine", isAuthorized, getMySubmissions);
// submissionRouter.get("/all", getAllSubmissions); 

export default submissionRouter;
