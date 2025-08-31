import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";
import { Response } from "../utils/Response.util.js";
import { generateToken } from "../utils/token.util.js";

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
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return Response(404, false, "User not found", res);

    Response(200, true, "User profile", res, user);
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
