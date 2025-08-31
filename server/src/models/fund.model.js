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
  }
}, { timestamps: true });

export const fundModel = model("Fund", FundSchema);
