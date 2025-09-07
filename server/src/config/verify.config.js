import { fundModel } from "../models/fund.model.js";
import { submissionModel } from "../models/submission.model.js";
import { taskModel } from "../models/task.model.js";
import haversineMeters from "../utils/geo.util.js";
import { withinWindow } from "../utils/time.util.js";
import { agent } from "./agent.config.js";

function applyFunds(amount, status) {
  if (status === "completed") {
    return { newAmount: amount + amount * 0.05, gainLoss: amount * 0.05 };
  } else {
    return { newAmount: amount - amount * 0.1, gainLoss: -(amount * 0.1) };
  }
}

async function verifyAndSettle(subId) {
  try {
    const sub = await submissionModel.findById(subId).populate("taskId");
    if (!sub) throw new Error("Submission not found");

    const task = sub.taskId;
    let ok = false;
    let reason = "";

    if (sub.kind === "photo" && sub.photo) {
      try {
        const result = await agent.invoke({
          messages: [
            {
              role: "system",
              content: `
                You are a strict verification AI.
                Compare the task title, description, and date range with the submitted photo.
                Decide if the photo is valid evidence for the task.
                Reply with ONLY one word: "VALID" or "INVALID".
                No explanations.`,
            },
            {
              role: "user",
              content: `Task Title: ${task.title || "N/A"}\nTask Description: ${
                task.description || "N/A"
              }\nTask Window: ${task.startAt} to ${
                task.endAt
              }\nSubmission Date: ${sub.createdAt}`,
            },
            {
              role: "user",
              content: [{ type: "image_url", image_url: sub.photo }],
            },
          ],
        });

        let responseText = "";
        if (result.output_text) {
          responseText = result.output_text;
        } else if (result.content) {
          responseText = result.content;
        } else if (result.message) {
          responseText = result.message;
        } else if (result.text) {
          responseText = result.text;
        } else if (typeof result === "string") {
          responseText = result;
        } else if (result.choices && result.choices[0]) {
          responseText =
            result.choices[0].message?.content || result.choices[0].text || "";
        }

        if (!responseText) {
          ok = false;
          reason = "AI verification failed - no response";
        } else {
          ok = ok = /^\s*valid\s*$/i.test(responseText.trim());
          reason = ok
            ? "Photo verified by AI agent against task details"
            : `Photo does not match task requirements: ${responseText}`;
        }
      } catch (aiError) {
        ok = false;
        reason = `AI verification error: ${aiError.message}`;
      }
    } else if (task.type === "travel" && sub.kind === "travel") {
      const inTime = withinWindow(
        new Date(sub.createdAt),
        task.startAt,
        task.endAt
      );
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
        ok = dist <= (task.targetLocation.radiusMeters || 100);
        if (!ok) reason = `Too far (${Math.round(dist)}m from target)`;
      }
    } else if (task.type === "general" && sub.kind === "general") {
      const hasProof = !!sub.photo || !!(sub.file && sub.file.path);
      ok = hasProof;
      if (!ok) reason = "No valid proof submitted";
      if (ok && sub.ai && sub.ai.imageTamperScore > 0.8) {
        ok = false;
        reason = "Image seems manipulated";
      }
    } else {
      reason = "Invalid submission type or kind mismatch";
    }

    const updateData = {
      status: ok ? "approved" : "rejected",
      reason: reason,
    };

    await submissionModel.findByIdAndUpdate(subId, updateData, { new: true });
    const updatedSub = await submissionModel.findById(subId);

    const taskStatus = ok ? "completed" : "failed";
    await taskModel.updateOne({ _id: task._id }, { status: taskStatus });

    const fund = await fundModel.findOne({ userId: task.userId });
    if (fund) {
      const { newAmount, gainLoss } = applyFunds(
        task.amount || fund.amount,
        taskStatus
      );
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
