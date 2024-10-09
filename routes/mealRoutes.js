import express from "express";
import mealController from "../controllers/mealController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js"; // Import multer configuration

const router = express.Router();

// Meal routes
router.get("/meals", mealController.getMeals);
router.get("/meals/:id", mealController.getMealById);
router.post(
  "/meals",
  authMiddleware,
  upload.single("image"),
  mealController.addMeal
);
router.put(
  "/meals/:id",
  authMiddleware,
  upload.single("image"),
  mealController.updateMeal
);
router.delete("/meals/:id", authMiddleware, mealController.deleteMeal);

export default router;
