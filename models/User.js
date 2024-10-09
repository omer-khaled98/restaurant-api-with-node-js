import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: "Your User name is required",
    },
    email: {
      type: String,
      required: "Your email is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: "Your password is required",
    },
    phone: {
      type: String,
      required: "Your phone is required",
    },
    address: {
      type: String,
      required: "Your address is required",
    },
    isEmailVerified: {
      // Fixed typo from isEmailVerfied
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    reservations: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },
    otp: String, // Add field to store OTP
    otpExpires: Date, // Add expiration time for OTP
  },
  { versionKey: false, timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
