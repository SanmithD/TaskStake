import { applyFunds } from "../config/verify.config.js";
import { fundModel } from "../models/fund.model.js";
import { submissionModel } from "../models/submission.model.js";

export default async function handleFundSettlement(task, taskStatus, submissionId) {
  try {
    const fund = await fundModel.findOne({ userId: task.userId });
    if (fund) {
      const { newAmount, gainLoss } = applyFunds(task.amount || fund.amount, taskStatus);
      fund.amount = newAmount;
      await fund.save();
      await submissionModel.findByIdAndUpdate(submissionId, { gainLoss });
    }
  } catch (error) {
    console.error("Fund settlement error:", error);
  }
}