import fs from "fs";
import cloudinary from "../config/cloudinary.config.js";
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

  // Handle file data (stored locally)
  const fileData = req.files?.file?.[0]
    ? {
        path: req.files.file[0].path,
        originalName: req.files.file[0].originalname,
        size: req.files.file[0].size,
      }
    : null;

  // Handle photo data (upload to Cloudinary)
  const photoFile = req.files?.photo?.[0];

  if (!taskId || !kind) {
    return Response(400, false, "Task ID and kind are required", res);
  }

  try {
    // Verify task exists and is active
    const task = await taskModel.findById(taskId);
    if (!task) {
      return Response(404, false, "Task not found", res);
    }

    if (task.status !== "pending") {
      return Response(400, false, "Task is not active", res);
    }

    // Check if user already submitted for this task
    const existingSubmission = await submissionModel.findOne({ taskId, userId });
    if (existingSubmission) {
      return Response(400, false, "You have already submitted for this task", res);
    }

    let photoData = null;
    if (photoFile) {
      try {
        // Upload the actual file to Cloudinary
        const uploadImage = await cloudinary.uploader.upload(photoFile.path, {
          folder: "TaskStake",
          resource_type: "auto"
        });
        photoData = uploadImage.secure_url;
        
        // Delete the local file after uploading to Cloudinary
        fs.unlinkSync(photoFile.path);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return Response(500, false, "Failed to upload photo", res);
      }
    }

    // Parse geo data safely
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
      file: fileData,
      ai: ai || null,
    });

    await submission.save();

    const result = await verifyService.verifyAndSettle(submission._id);

    Response(201, true, "Submission created and processed", res, { 
      submission, 
      verification: result 
    });
  } catch (error) {
    console.error("Submission creation error:", error);
    
    // Clean up uploaded files if there's an error
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
      .sort({ createdAt: -1 }); // Most recent first
    
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

    // Update task status
    task.status = "cancelled";
    await task.save();

    // Apply cancellation penalty to funds
    const fund = await fundModel.findOne({ userId });
    if (fund && task.amount) {
      // Deduct 5% of the task amount as penalty
      const penalty = task.amount * 0.05;
      fund.amount = Math.max(0, fund.amount - penalty); // Ensure amount doesn't go negative
      await fund.save();
      
      Response(200, true, "Task cancelled successfully", res, { 
        task, 
        fund,
        penalty 
      });
    } else {
      Response(200, true, "Task cancelled successfully", res, { task });
    }
  } catch (error) {
    console.error("Cancel task error:", error);
    Response(500, false, "Server error", res);
  }
};
