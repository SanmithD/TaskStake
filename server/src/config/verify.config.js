import { fundModel } from "../models/fund.model.js";
import { submissionModel } from "../models/submission.model.js";
import { taskModel } from "../models/task.model.js";
import haversineMeters from "../utils/geo.util.js";
import { withinWindow } from "../utils/time.util.js";

function applyFunds(amount, status) {
  if (status === "completed") {
    return { newAmount: amount + amount * 0.05, gainLoss: amount * 0.05 };
  } else {
    return { newAmount: amount - amount * 0.1, gainLoss: -(amount * 0.1) };
  }
}

async function verifyAndSettle(subId) {
  const sub = await submissionModel.findById(subId).populate("taskId");
  if (!sub) throw new Error("Submission not found");

  const task = sub.taskId;
  let ok = false;
  let reason = "";

  const inTime = withinWindow(
    new Date(sub.createdAt),
    task.startAt,
    task.endAt
  );

  if (!inTime) {
    reason = "Submission outside time window";
  } else if (task.type === "travel" && sub.kind === "travel") {
    if (!sub.geo || !task.targetLocation) {
      ok = false;
      reason = "Missing location data";
    } else {
      const dist = haversineMeters(
        sub.geo.lat,
        sub.geo.lng,
        task.targetLocation.lat,
        task.targetLocation.lng
      );
      ok = dist <= (task.targetLocation.radiusMeters || 100);
      if (!ok) reason = `Too far (${Math.round(dist)}m from target)`;
    }
  } else if (task.type === "general" && sub.kind === "general") {
    // Fixed: Check for photo URL string or file path
    const hasProof = !!(sub.photo) || !!(sub.file && sub.file.path);
    ok = hasProof;
    if (!ok) reason = "No valid proof submitted";

    // AI tamper detection (if AI analysis is available)
    if (ok && sub.ai && typeof sub.ai === 'object' && sub.ai.imageTamperScore > 0.8) {
      ok = false;
      reason = "Image seems manipulated";
    }
  } else {
    reason = "Invalid submission type or kind mismatch";
  }

  // Update submission
  sub.status = ok ? "approved" : "rejected";
  sub.reason = reason;
  await sub.save();

  // Update task status
  const taskStatus = ok ? "completed" : "failed";
  await taskModel.updateOne({ _id: task._id }, { status: taskStatus });

  // Update funds
  const fund = await fundModel.findOne({ userId: task.userId });
  if (fund) {
    const { newAmount, gainLoss } = applyFunds(task.amount || fund.amount, taskStatus);
    fund.amount = newAmount;
    await fund.save();

    sub.gainLoss = gainLoss;
    await sub.save();
  }

  return { ok, reason, status: taskStatus };
}

export default { verifyAndSettle };
