import fs from "fs";
import cloudinary from "../config/cloudinary.config.js";
import { fundModel } from "../models/fund.model.js";
import { submissionModel } from "../models/submission.model.js";
import { taskModel } from "../models/task.model.js";
import { Response } from "../utils/Response.util.js";
import handleFundSettlement from "../utils/handleFund.util.js";
import performAIVerification from "./agent.controller.js";

export const createSubmission = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  const { taskId } = req.params;
  const { kind, geo, ai } = req.body;
  const photoFile = req.files?.photo?.[0];

  if (!taskId || !kind) {
    return Response(400, false, "Task ID and kind are required", res);
  }

  try {
    const task = await taskModel.findById(taskId);
    if (!task) return Response(404, false, "Task not found", res);
    if (task.status !== "pending") return Response(400, false, "Task is not active", res);

    const existingSubmission = await submissionModel.findOne({ taskId, userId });
    if (existingSubmission) {
      return Response(400, false, "You have already submitted for this task", res);
    }

    let photoData = null;
    if (photoFile) {
      try {
        const uploadImage = await cloudinary.uploader.upload(photoFile.path, {
          folder: "TaskStake",
          resource_type: "auto"
        });
        photoData = {
      url: uploadImage.secure_url,
      publicId: uploadImage.public_id,  
    };
        fs.unlinkSync(photoFile.path);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return Response(500, false, "Failed to upload photo", res);
      }
    }

    let geoData = null;
    if (geo) {
      try {
        geoData = typeof geo === 'string' ? JSON.parse(geo) : geo;
      } catch (parseError) {
        return Response(400, false, "Invalid geo data format", res);
      }
    }

    const submission = new submissionModel({
      taskId,
      userId,
      kind,
      geo: geoData,
      photo: photoData,
      file: req.files?.file?.[0] ? {
        path: req.files.file[0].path,
        originalName: req.files.file[0].originalname,
        size: req.files.file[0].size,
      } : null,
      ai: ai || null,
    });

    await submission.save();

    let verificationResult = { ok: true, reason: "No verification needed" };
    
    if (kind === "photo" && photoData) {
      try {
        verificationResult = await performAIVerification(submission._id, task);
      } catch (aiError) {
        console.error("AI verification failed:", aiError);
        verificationResult = { 
          ok: false, 
          reason: `AI verification failed: ${aiError.message}` 
        };
      }
    }

    const finalStatus = verificationResult.ok ? "approved" : "rejected";
    await submissionModel.findByIdAndUpdate(submission._id, {
      status: finalStatus,
      reason: verificationResult.reason
    });

    const taskStatus = verificationResult.ok ? "completed" : "failed";
    await taskModel.updateOne({ _id: task._id }, { status: taskStatus });

    await handleFundSettlement(task, taskStatus, submission._id);

    Response(201, true, "Submission created and verified", res, {
      submission: await submissionModel.findById(submission._id),
      verification: verificationResult
    });

  } catch (error) {
    console.error("Submission creation error:", error);
    if (photoFile && fs.existsSync(photoFile.path)) {
      fs.unlinkSync(photoFile.path);
    }
    Response(500, false, "Server error during submission", res);
  }
};

export const getMySubmissions = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  try {
    const subs = await submissionModel
      .find({ userId })
      .populate("taskId")
      .sort({ createdAt: -1 }); 
    Response(200, true, "User submissions", res, subs);
  } catch (error) {
    console.error("Get submissions error:", error);
    Response(500, false, "Server error", res);
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const subs = await submissionModel
      .find()
      .populate("taskId userId")
      .sort({ createdAt: -1 });

    Response(200, true, "All submissions", res, subs);
  } catch (error) {
    console.error("Get all submissions error:", error);
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
    if (fund && task.amount) {
      const penalty = task.amount * 0.05;
      fund.amount = Math.max(0, fund.amount - penalty); 
      await fund.save();

      Response(200, true, "Task cancelled successfully", res, {
        task,
        fund,
        penalty,
      });
    } else {
      Response(200, true, "Task cancelled successfully", res, { task });
    }
  } catch (error) {
    console.error("Cancel task error:", error);
    Response(500, false, "Server error", res);
  }
};
