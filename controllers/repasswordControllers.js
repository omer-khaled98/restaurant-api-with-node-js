import User from "../models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or use any other email service
  auth: {
    user: "ititestapps@gmail.com",
    pass: "brku abbm sugn yqvl",
  },
});

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and set OTP with expiration (10 minutes)
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: "rest password form APO ALAM",
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your code for password reset `,

      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="../Resturant-APOALAM/FrontEnd/public/logo3.png" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">APOALAM </a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Your Brand. Use the following OTP to complete Rest Your Password . OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />APOALAM</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Your Brand Inc</p>
      <p>1600 Amphitheatre Parkway</p>
      <p>California</p>
    </div>
  </div>
</div>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Reset Password with OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Find user by email and valid OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }, // Ensure OTP is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Code or Email" });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined; // Clear OTP
    user.otpExpires = undefined; // Clear OTP expiration
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};
