import Meal from "../models/Meal.js"; // Use .js extension with import
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

// Get all meals with pagination and filtering
// const getMeals = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, category, priceRange } = req.query;
//     const query = {};

//     if (category) query.category = category;
//     if (priceRange) {
//       const [min, max] = priceRange.split("-");
//       query.price = { $gte: Number(min), $lte: Number(max) };
//     }

//     const [meals, count] = await Promise.all([
//       Meal.find(query)
//         .limit(limit * 1)
//         .skip((page - 1) * limit)
//         .exec(),
//       Meal.countDocuments(query),
//     ]);

//     return res.json({
//       meals,
//       totalPages: Math.ceil(count / limit),
//       currentPage: Number(page),
//     });
//   } catch (error) {
//     console.error("Error fetching meals:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
const getMeals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      priceRange,
      sortBy = "name",
      order = "asc",
    } = req.query;
    const query = {};

    // Filtering by category
    if (category) query.category = category;

    // Filtering by price range
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      query.price = { $gte: Number(min), $lte: Number(max) };
    }

    // Sorting logic
    let sortQuery = {};
    if (sortBy === "price") {
      sortQuery.price = order === "asc" ? 1 : -1; // Ascending or descending order
    } else if (sortBy === "name") {
      sortQuery.name = order === "asc" ? 1 : -1; // Alphabetical order
    }

    // Fetching meals and total count
    const [meals, count] = await Promise.all([
      Meal.find(query)
        .sort(sortQuery) // Apply sorting
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec(),
      Meal.countDocuments(query),
    ]);

    res.status(200).json({
      results:count,
      meals,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific meal by ID
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    return res.json(meal);
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new meal (admin only)
const addMeal = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const optimizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .toFormat("jpeg", { quality: 80, chromaSubsampling: "4:4:4" })
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(optimizedBuffer);
    });

    const newMeal = new Meal({
      ...req.body,
      imageUrl: result.secure_url,
    });

    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a specific meal (admin only)
const updateMeal = async (req, res) => {
  try {
    const updatedData = req.body;

    if (req.file && req.file.buffer) {
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .toFormat("jpeg", { quality: 80, chromaSubsampling: "4:4:4" })
        .toBuffer();

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(optimizedBuffer);
      });

      updatedData.imageUrl = result.secure_url;
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!updatedMeal)
      return res.status(404).json({ message: "Meal not found" });

    res.json(updatedMeal);
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ message: error.message });
  }
};

// Remove a meal from the menu (admin only)
const deleteMeal = async (req, res) => {
  try {
    const deletedMeal = await Meal.findByIdAndDelete(req.params.id);
    if (!deletedMeal)
      return res.status(404).json({ message: "Meal not found" });
    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ message: error.message });
  }
};
export default {
  getMeals,
  getMealById,
  addMeal,
  updateMeal,
  deleteMeal,
};
