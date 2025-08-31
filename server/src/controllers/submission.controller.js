import verifyService from "../config/verify.config.js";
import { submissionModel } from "../models/submission.model.js";
import { Response } from "../utils/Response.util.js";

// CREATE SUBMISSION 
export const createSubmission = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  const { taskId, kind, geo, photo, file, ai } = req.body;

  if (!taskId || !kind) 
    return Response(400, false, "Task ID and kind are required", res);

  try {
    const submission = new submissionModel({
      taskId,
      userId,
      kind,
      geo,
      photo,
      file,
      ai
    });

    await submission.save();

    // call verification right after submission
    const result = await verifyService.verifyAndSettle(submission._id);

    Response(201, true, "Submission created", res, { submission, result });
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

// GET USER SUBMISSIONS 
export const getMySubmissions = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  try {
    const subs = await submissionModel.find({ userId }).populate("taskId");
    Response(200, true, "User submissions", res, subs);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

// GET ALL SUBMISSIONS (ADMIN/DEBUG)
export const getAllSubmissions = async (req, res) => {
  try {
    const subs = await submissionModel.find().populate("taskId userId");
    Response(200, true, "All submissions", res, subs);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};
