import { fundModel } from "../models/fund.model.js";
import { Response } from "../utils/Response.util.js";

export const addFund = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  const { amount } = req.body;
  if (!amount || amount <= 0)
    return Response(400, false, "Valid amount is required", res);

  try {
    let fund = await fundModel.findOne({ userId });

    if (fund) {
      fund.amount += Number(amount);

      fund.recentAdded.unshift({
        cash: Number(amount),
        date: new Date(),
      });

      if (fund.recentAdded.length > 20) {
        fund.recentAdded = fund.recentAdded.slice(0, 20);
      }

      await fund.save();
      return Response(200, true, "Funds updated successfully", res, fund);
    }

    fund = new fundModel({
      userId,
      amount: Number(amount),
      recentAdded: [{ cash: Number(amount), date: new Date() }],
    });
    await fund.save();

    Response(201, true, "Funds added successfully", res, fund);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const getFunds = async (req, res) => {
  try {
    const fund = await fundModel.findOne({ userId: req.user._id });
    if (!fund) return Response(404, false, "No funds found", res);

    Response(200, true, "Funds fetched", res, fund);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const withdrawFund = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return Response(403, false, "Unauthorized", res);

  const { amount } = req.body;
  if (!amount || amount <= 0)
    return Response(400, false, "Valid withdrawal amount is required", res);

  try {
    const fund = await fundModel.findOne({ userId });
    if (!fund) return Response(404, false, "No funds found", res);

    if (fund.amount < amount)
      return Response(400, false, "Insufficient balance", res);

    // Deduct balance
    fund.amount -= amount;

    // Save withdrawal history
    fund.recentWithdrawals.push({ cash: amount });

    await fund.save();

    Response(200, true, "Withdrawal successful", res, { balance: fund.amount });
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const getWithdrawHistory = async(req, res) =>{
  const userId = req.user?._id;
  if(!userId) return Response(403, false, "Unauthorized", res);
  try {
    const response = await fundModel.find({ userId }).select("recentWithdrawals");
    if(!response) return Response(404, false, "Not found", res);

    Response(200, true, "Recent withdraw", res, response);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server Error", res);
  }
}