import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  type: { type: String, enum: ["travel", "general"], required: true },
  targetLocation: {
    lat: Number,
    lng: Number,
    radiusMeters: { type: Number, default: 100 }
  },
  startAt: Date,
  endAt: Date,
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }
}, { timestamps: true });

export const taskModel = model("Task", TaskSchema);
