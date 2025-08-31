import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, index: true },
    password: String,
  },
  { timestamps: true }
);

export const userModel = model("User", UserSchema);
