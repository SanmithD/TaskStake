import cloudinary from "../config/cloudinary.config.js";
import { fundModel } from "../models/fund.model.js";
import { submissionModel } from "../models/submission.model.js";
import { taskModel } from "../models/task.model.js";
import { Response } from "../utils/Response.util.js";

export const addTask = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  const { title, type, targetLocation, startAt, endAt, status } = req.body;

  if (!title || !type) {
    return Response(400, false, "Title and type are required", res);
  }

  try {
    const newTask = new taskModel({
      userId,
      title,
      type,
      startAt,
      endAt,
      status: status || "pending",
      targetLocation: targetLocation
        ? {
            lat: targetLocation.lat,
            lng: targetLocation.lng,
            radiusMeters: targetLocation.radiusMeters || 100,
          }
        : undefined,
    });

    await newTask.save();
    return Response(201, true, "Task created successfully", res, newTask);
  } catch (error) {
    console.error(error);
    return Response(500, false, "Server error", res);
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    if(!tasks) return Response(404, false, "Not found", res);

    Response(200, true, "User tasks", res, tasks);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await taskModel.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!task) return Response(404, false, "Task not found", res);

    Response(200, true, "Task details", res, task);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await taskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return Response(404, false, "Task not found", res);

    Response(200, true, "Task updated", res, task);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!task) return Response(404, false, "Task not found", res);

    const submissions = await submissionModel.find({ taskId: task._id });

    for (const sub of submissions) {
      if (sub.photo?.publicId) {
        try {
          await cloudinary.uploader.destroy(sub.photo.publicId);
          console.log(`Deleted photo ${sub.photo.publicId} from Cloudinary`);
        } catch (err) {
          console.error(`Error deleting Cloudinary image:`, err);
        }
      }
    }

    await submissionModel.deleteMany({ taskId: task._id });

    Response(200, true, "Task and related submissions deleted", res);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};


export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  if (!["pending", "completed", "failed"].includes(status))
    return Response(400, false, "Invalid status", res);

  try {
    const task = await taskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    if (!task) return Response(404, false, "Task not found", res);

    Response(200, true, "Task status updated", res, task);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

function applyFunds(amount, status) {
  return status === "completed"
    ? amount + amount * 0.05
    : amount - amount * 0.10;
}

export const autoFailExpiredTasks = async (req, res) => {
  try {
    const now = new Date();

    const expiredTasks = await taskModel.find({
      status: "pending",
      endAt: { $lt: now }
    });

    if (!expiredTasks.length) {
      return Response(200, true, "No expired tasks found", res);
    }

    const results = [];

    for (const task of expiredTasks) {
      task.status = "failed";
      await task.save();

      const fund = await fundModel.findOne({ userId: task.userId });
      if (fund) {
        fund.amount = applyFunds(fund.amount, "failed");
        await fund.save();
      }

      results.push({ taskId: task._id, userId: task.userId, status: "failed" });
    }

    Response(200, true, "Expired tasks processed", res, results);

  } catch (error) {
    console.error(error);
    Response(500, false, "Server error", res);
  }
};
