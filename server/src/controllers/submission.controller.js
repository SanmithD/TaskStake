import verifyService from "../config/verify.config.js";
import { fundModel } from "../models/fund.model.js";
import { submissionModel } from "../models/submission.model.js";
import { taskModel } from "../models/task.model.js";
import { Response } from "../utils/Response.util.js";

export const createSubmission = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  const { taskId } = req.params;
  const { kind, geo, ai } = req.body;

  const photoData = req.files?.photo?.[0]
  ? {
      publicId: req.files.photo[0].filename,
      url: req.files.photo[0].path,
    }
  : null;

const fileData = req.files?.file?.[0]
  ? {
      path: req.files.file[0].path,
      originalName: req.files.file[0].originalname,
      size: req.files.file[0].size,
    }
  : null;



  if (!taskId || !kind)
    return Response(400, false, "Task ID and kind are required", res);

  try {
    const submission = new submissionModel({
      taskId,
      userId,
      kind,
      geo,
      photo: photoData,
      file: fileData,
      ai,
    });

    await submission.save();

    const result = await verifyService.verifyAndSettle(submission._id);

    Response(201, true, "Submission created", res, { submission, result });
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

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

export const getAllSubmissions = async (req, res) => {
  try {
    const subs = await submissionModel.find().populate("taskId userId");
    Response(200, true, "All submissions", res, subs);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const cancelTask = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  const { taskId } = req.params;
  if (!taskId) return Response(400, false, "Task ID is required", res);

  try {
    const task = await taskModel.findOne({ _id: taskId, userId });
    if (!task) return Response(404, false, "Task not found", res);

    if (["completed", "failed", "cancelled"].includes(task.status)) {
      return Response(400, false, "Task cannot be cancelled", res);
    }

    task.status = "cancelled";
    await task.save();

    const fund = await fundModel.findOne({ userId });
    if (fund) {
      fund.amount = fund.amount - fund.amount * 0.05;
      await fund.save();
    }

    Response(200, true, "Task cancelled successfully", res, { task, fund });
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};
