// =====================
import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  estimatedTime: { type: Number },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
