import { Schema, model } from "mongoose";

const FundSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    unique: true 
  },
  amount: { 
    type: Number, 
    default: 0 
  },
  recentAdded: [
    {
      cash: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  recentWithdrawals: [
    {
      cash: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export const fundModel = model("Fund", FundSchema);
