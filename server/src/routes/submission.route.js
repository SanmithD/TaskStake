import express from "express";
import { cancelTask, createSubmission, getMySubmissions } from "../controllers/submission.controller.js";
import { isAuthorized } from "../middlewares/administer.middleware.js";
import { uploadPhoto } from "../middlewares/uploadCloud.middleware.js";
import { uploadFile } from "../middlewares/uploadLocal.middleware.js";

const submissionRouter = express.Router();

submissionRouter.post(
  "/create/:taskId",
  isAuthorized,
  uploadPhoto.fields([{ name: "photo", maxCount: 1 }]),
  uploadFile.fields([{ name: "file", maxCount: 1 }]),
  createSubmission
);


submissionRouter.get("/mine", isAuthorized, getMySubmissions);
submissionRouter.post("/cancel/:taskId", isAuthorized, cancelTask);
// submissionRouter.get("/all", getAllSubmissions); 

export default submissionRouter;
