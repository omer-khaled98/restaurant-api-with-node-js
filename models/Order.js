import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    mealItems: [
      {
        mealId: {
          type: Schema.Types.ObjectId,
          ref: "Meal",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalPrice: Number,
    status: {
      type: String,
      enum: ["pending", "cancel", "confirm"],
      default: "pending",
    },
    // New: Shipping details
    shippingDetails: {
      phone: { type: String, require: true },
      address: { type: Object, required: true },
      // city: { type: String, required: true },
      // postalCode: { type: String, required: true },
      comment: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { versionKey: false, timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
