import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealItems: [
      {
        mealId: {
          type: Schema.Types.ObjectId,
          ref: "Meal",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        price: Number, // Set when adding the meal
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
