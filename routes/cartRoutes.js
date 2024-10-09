import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addToCart,
  checkOut,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";

const cartRoute = express.Router();
cartRoute.use(authMiddleware);

cartRoute.get("/cart", getCart);
cartRoute.post("/cart/:id", addToCart);
cartRoute.put('/cart/:id', updateCartQuantity);
cartRoute.delete("/cart/:id", removeFromCart);
cartRoute.delete("/cart", clearCart);
cartRoute.post("/cart", checkOut);

export default cartRoute;
