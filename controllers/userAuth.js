// ==================
import userModel from "../models/User.js"; // Update the path as needed
import bcrypt from "bcrypt";
import sendVerfication from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Sign Up
export const signUp = async (req, res) => {
  try {
    const findUser = await userModel.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(409).json({ message: "You already have an account" });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 8);
    const newUser = await userModel.create(req.body); // Changed insertMany to create for a single document
    sendVerfication(req.body.email, req.body.userName);
    return res
      .status(201)
      .json({ message: "Signed up successfully!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to sign up", error: err.message });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const findUser = await userModel.findOneAndUpdate(
      { email: req.params.email },
      { isEmailVerified: true },
      { new: true }
    );
    if (findUser) {
      res
        .status(200)
        .json({ message: "Your email is verified!", user: findUser });
    } else {
      res.status(404).json({ message: "No email found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to verify email", error: err.message });
  }
};

// Sign In
export const signIn = async (req, res) => {
  try {
    const isUser = await userModel.findOne({ email: req.body.email });
    if (isUser && bcrypt.compareSync(req.body.password, isUser.password)) {
      // if (!isUser.isEmailVerified)
      //   return res.status(403).json({ message: "Please Verify Your Account... Check Your Inbox Mail!" });

      // استبعاد كلمة المرور من بيانات المستخدم
      const { password, ...userWithoutPassword } = isUser.toObject();

      // توقيع الـ token بدون كلمة المرور
      const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      res.json({ message: `Welcome ${isUser.userName}`, token });
    } else {
      res.status(401).json({ message: "Please Check Your Email Or Passwrod" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to sign in", error: err.message });
  }
};

// Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    const findUser = await userModel.findById(req.user._id);
    res.status(200).json(findUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve profile", error: err.message });
  }
};
