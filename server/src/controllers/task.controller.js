import { taskModel } from "../models/task.model.js";
import { Response } from "../utils/Response.util.js";

// ADD TASK
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


// GET ALL TASKS 
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

// GET SINGLE TASK 
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

// UPDATE TASK 
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

// DELETE TASK 
export const deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!task) return Response(404, false, "Task not found", res);

    Response(200, true, "Task deleted", res);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

// UPDATE STATUS ONLY 
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
