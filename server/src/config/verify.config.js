import { fundModel } from "../models/fund.model.js";
import { submissionModel } from "../models/submission.model.js";
import { taskModel } from "../models/task.model.js";
import { haversineMeters } from "../utils/geo.util.js";
import { withinWindow } from "../utils/time.util.js";

function applyFunds(amount, status) {
  return status === "completed"
    ? amount + amount * 0.05
    : amount - amount * 0.10;
}

async function verifyAndSettle(subId) {
  const sub = await submissionModel.findById(subId).populate("taskId");
  if (!sub) throw new Error("Submission not found");

  const task = sub.taskId;
  let ok = false;
  let reason = "";

  const inTime = withinWindow(new Date(sub.createdAt), task.startAt, task.endAt);

  if (task.type === "travel" && sub.kind === "travel") {
    const dist = haversineMeters(sub.geo.lat, sub.geo.lng, task.targetLocation.lat, task.targetLocation.lng);
    ok = inTime && dist <= (task.targetLocation.radiusMeters || 100);
    if (!ok) reason = `Too far (${Math.round(dist)}m)`;

  } else if (task.type === "general") {
    const hasProof = !!(sub.photo && sub.photo.url) || !!(sub.file && sub.file.path);
    ok = inTime && hasProof;
    if (!ok) reason = "No valid proof submitted";

    if (ok && sub.ai && sub.ai.imageTamperScore > 0.8) {
      ok = false;
      reason = "Image seems manipulated";
    }

  } else {
    reason = "Invalid submission type";
  }

  sub.status = ok ? "approved" : "rejected";
  sub.reason = reason;
  await sub.save();

  const taskStatus = ok ? "completed" : "failed";
  await taskModel.updateOne({ _id: task._id }, { status: taskStatus });

  const fund = await fundModel.findOne({ userId: task.userId });
  if (fund) {
    fund.amount = applyFunds(fund.amount, taskStatus);
    await fund.save();
  }

  return { ok, reason };
}

export default { verifyAndSettle };
