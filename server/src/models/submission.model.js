import { Schema, model } from "mongoose";

const SubmissionSchema = new Schema({
  taskId: { 
    type: Schema.Types.ObjectId, 
    ref: "Task",
    required: true
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  kind: { 
    type: String, 
    enum: ["travel", "photo", "file", "general", "work", "personal"],
    required: true 
  },
  geo: {
    lat: Number,
    lng: Number,
    accuracyMeters: Number,
    capturedAt: Date
  },
  photo: {
    url: String,   
    publicId: String, 
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
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  gainLoss: {
    type: Number,
    default: 0
  },
  reason: {
    type: String,
    default: ""
  }
}, { 
  timestamps: true 
});

SubmissionSchema.index({ taskId: 1, userId: 1 }, { unique: true });
SubmissionSchema.index({ userId: 1 });
SubmissionSchema.index({ status: 1 });

export const submissionModel = model("Submission", SubmissionSchema);
