import { Schema, model } from "mongoose";

const SubmissionSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: "Task" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  kind: { type: String, enum: ["travel", "photo", "file"], required: true },
  geo: {
    lat: Number,
    lng: Number,
    accuracyMeters: Number,
    capturedAt: Date
  },
  photo: {
    publicId: String,
    url: String
  },
  file: {
    path: String,
    originalName: String,
    size: Number
  },
  ai: {
    exifOk: Boolean,
    imageTamperScore: Number,
    contentNotes: String
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  reason: String
}, { timestamps: true });

export const submissionModel = model("Submission", SubmissionSchema);
