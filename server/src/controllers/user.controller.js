import bcrypt from "bcrypt";
import { OAuth2Client } from 'google-auth-library';
import { fundModel } from "../models/fund.model.js";
import { taskModel } from "../models/task.model.js";
import { userModel } from "../models/user.model.js";
import { Response } from "../utils/Response.util.js";
import { generateToken } from "../utils/token.util.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return Response(400, false, "All fields are required", res);

  try {
    const user = await userModel.findOne({ email });
    if (user) return Response(400, false, "User already exists", res);

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashPass,
    });
    await newUser.save();

    const token = generateToken(newUser._id, res);

    const safeUser = { _id: newUser._id, name: newUser.name, email: newUser.email };
    Response(201, true, "New user created", res, safeUser, token);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return Response(400, false, "Email and password are required", res);

  try {
    const user = await userModel.findOne({ email });
    if (!user) return Response(404, false, "User not found", res);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return Response(401, false, "Invalid credentials", res);

    const token = generateToken(user._id, res);

    const safeUser = { _id: user._id, name: user.name, email: user.email };
    Response(200, true, "Login successful", res, safeUser, token);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    const userTask = await taskModel.find({userId: req.user._id}).sort({ createdAt: -1 });
    const userCapital = await fundModel.find({userId: req.user._id}).sort({ createdAt: -1 });
    if (!user) return Response(404, false, "User not found", res);

    const data = {
      profile: user,
      task: userTask,
      amount: userCapital
    }
    Response(200, true, "User profile", res, data);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    if(!userId) return Response(403, false, "Unauthorized", res);

    const response = await userModel.findByIdAndDelete(userId);
    Response(200, true, "User profile", res, response);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    Response(200, true, "Logged out", res);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res);
  }
};

export const updateProfile = async(req, res) =>{
  const id = req.user._id;
  if(!id) return Response(403, false, 'Unauthorized', res);
  try {
    const { name, email } = req.body;

    const response = await userModel.findByIdAndUpdate(id,{
      name,
      email
    },{ new: true });

    if(!response) return Response(404, false, "Not found", res);
    await response.save();
    Response(200, true, 'Profile updated', res);
  } catch (error) {
    console.log(error);
    Response(500, false, "Server error", res)
  }
}

export const signupWithGoogle = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return Response(400, false, "Invalid credential", res);

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        name,
        email,
        password: "", // no password for Google users
      });
      await user.save();
    }

    const token = generateToken(user._id, res);
    return Response(200, true, "Login success", res, user, token);
  } catch (error) {
    console.log(error);
    return Response(500, false, "Server error", res);
  }
};
