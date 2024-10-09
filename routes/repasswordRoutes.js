import express from "express";
// import { forgotPassword, resetPassword } from "../controllers/repassword.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/repasswordControllers.js";

const repassword = express.Router();

// Forgot Password - Send OTP
repassword.post("/forgot-password", forgotPassword);

// Reset Password - Verify OTP and Reset Password
repassword.post("/reset-password", resetPassword);

export default repassword;
