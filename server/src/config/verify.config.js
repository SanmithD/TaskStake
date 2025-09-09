import { fundModel } from "../models/fund.model.js";
import { submissionModel } from "../models/submission.model.js";
import { taskModel } from "../models/task.model.js";
import haversineMeters from "../utils/geo.util.js";
import { withinWindow } from "../utils/time.util.js";

export function applyFunds(amount, status) {
  const numAmount = Number(amount) || 0;

  if (status === "completed") {
    return { 
      newAmount: numAmount + numAmount * 0.05, 
      gainLoss: numAmount * 0.05 
    };
  } else {
    return { 
      newAmount: numAmount - numAmount * 0.1, 
      gainLoss: -(numAmount * 0.1) 
    };
  }
}


async function verifyAndSettle(subId) {
  try {
    const sub = await submissionModel.findById(subId).populate("taskId");
    if (!sub) throw new Error("Submission not found");

    const task = sub.taskId;
    let ok = false;
    let reason = "";

    if (task.type === "photo" && sub.kind === "photo") {
      if (!sub.photo) {
        ok = false;
        reason = "No photo provided";
      } else if (sub.ai && sub.ai.imageTamperScore > 0.8) {
        ok = false;
        reason = "Photo seems manipulated";
      } else {
        ok = true;
        reason = "Photo submission accepted";
      }

    } else if (task.type === "travel" && sub.kind === "travel") {
      const inTime = withinWindow(new Date(sub.createdAt), task.startAt, task.endAt);
      if (!inTime) {
        ok = false;
        reason = "Submission outside time window";
      } else if (!sub.geo || !task.targetLocation) {
        ok = false;
        reason = "Missing location data";
      } else {
        const dist = haversineMeters(
          sub.geo.lat,
          sub.geo.lng,
          task.targetLocation.lat,
          task.targetLocation.lng
        );

        const minTravelDistance = 100;
        const maxRadius = task.targetLocation.radiusMeters || 200; 

        if (dist < minTravelDistance) {
          ok = false;
          reason = `You must move at least ${minTravelDistance}m from the start location`;
        } else if (dist > maxRadius) {
          ok = false;
          reason = `Too far (${Math.round(dist)}m from target location)`;
        } else {
          ok = true;
          reason = "Travel submission accepted";
        }
      }

    } else if (task.type === "general" && sub.kind === "general") {
      const hasProof = !!sub.photo || !!(sub.file && sub.file.path);
      if (!hasProof) {
        ok = false;
        reason = "No proof submitted";
      } else if (sub.ai && sub.ai.imageTamperScore > 0.8) {
        ok = false;
        reason = "Proof seems manipulated";
      } else {
        ok = true;
        reason = "General submission accepted";
      }

    } else {
      reason = "Invalid submission type or kind mismatch";
    }

    const updateData = { status: ok ? "approved" : "rejected", reason };
    await submissionModel.findByIdAndUpdate(subId, updateData, { new: true });
    const updatedSub = await submissionModel.findById(subId);

    const taskStatus = ok ? "completed" : "failed";
    await taskModel.updateOne({ _id: task._id }, { status: taskStatus });

    const fund = await fundModel.findOne({ userId: task.userId });
    if (fund) {
      const { newAmount, gainLoss } = applyFunds(task.amount || fund.amount, taskStatus);
      fund.amount = newAmount;
      await fund.save();
      await submissionModel.findByIdAndUpdate(subId, { gainLoss });
    }

    return { ok, reason, status: taskStatus };

  } catch (error) {
    throw error;
  }
}

export default { verifyAndSettle };
