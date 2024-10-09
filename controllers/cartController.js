import cartModel from "../models/Cart.js";
import orderModel from "../models/Order.js";
import userModel from "../models/User.js";

const getCart = async (req, res) => {
  const userCart = await cartModel.find({ userId: req.user._id }).populate({
    path: "mealItems.mealId",
    select: "name price description imageUrl",
  });
  if (userCart) {
    return res
      .status(200)
      .json({ message: "Cart fetched successfully", cart: userCart });
  } else {
    return res.status(404).json({ message: "There is No Cart" });
  }
};

const addToCart = async (req, res) => {
  const mealId = req.params.id;
  const quantity = req.body.quantity;
  const userCart = await cartModel.findOne({ userId: req.user._id });

  // if user already have cart
  if (userCart) {
    const mealIndex = userCart.mealItems.findIndex(
      (item) => item.mealId == mealId
    );
    // if user already have this meal in the cart
    if (mealIndex !== -1) {
      userCart.mealItems[mealIndex].quantity += quantity;
    } else {
      userCart.mealItems.push({ mealId, quantity });
    }
    // Recalculate totalAmount
    await userCart.populate({
      path: "mealItems.mealId",
      select: "price",
    });

    const newTotalAmount = userCart.mealItems.reduce((acc, item) => {
      return acc + item.mealId.price * item.quantity;
    }, 0);

    userCart.totalAmount = newTotalAmount;

    await userCart.save();
    return res
      .status(200)
      .json({ message: "Cart updated successfully", cart: userCart });
  } else {
    // Create a new Cart if it first time to add to cart
    const newCart = new cartModel({
      userId: req.user._id,
      mealItems: [{ mealId, quantity }],
    });

    // Populate mealId to get the price for the new meal
    await newCart.populate({
      path: "mealItems.mealId",
      select: "price",
    });

    // Calculate totalAmount for the new cart
    const newTotalAmount = newCart.mealItems.reduce((acc, item) => {
      return acc + item.mealId.price * item.quantity;
    }, 0);

    newCart.totalAmount = newTotalAmount;

    await newCart.save();
    await userModel.findByIdAndUpdate(req.user._id, { cart: newCart._id });
    return res
      .status(201)
      .json({ message: "Meal Added to Cart successfully", cart: newCart });
  }
};

const updateCartQuantity = async (req, res) => {
  const mealId = req.params.id; // Meal to update
  const quantity = req.body.quantity; // New quantity

  // Check if quantity is valid (e.g., not less than 1)
  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  try {
    // Find the user's cart
    const userCart = await cartModel.findOne({ userId: req.user._id }).populate({
      path: "mealItems.mealId",
      select: "name price description imageUrl",
    });


    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the meal in the user's cart
    const mealIndex = userCart.mealItems.findIndex(
      (item) => item.mealId._id == mealId
    );

    if (mealIndex === -1) {
      return res.status(404).json({ message: "Meal not found in cart" });
    }

    // Update the quantity
    userCart.mealItems[mealIndex].quantity = quantity;

    // Recalculate the total amount of the cart
    const newTotalAmount = userCart.mealItems.reduce((acc, item) => {
      return acc + item.mealId.price * item.quantity;
    }, 0);

    // Update the totalAmount in the cart
    userCart.totalAmount = newTotalAmount;

    // Save the updated cart
    await userCart.save();

    return res
      .status(200)
      .json({ message: "Quantity updated successfully", cart: userCart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const userCart = await cartModel.findOne({ userId: req.user._id }).populate({
      path: "mealItems.mealId",
      select: "price",
    });

    if (!userCart) {
      return res.status(409).json({ message: "No Cart Found" });
    }

    const findMeal = userCart.mealItems.find(
      (meal) => meal.mealId._id == req.params.id
    );

    if (!findMeal) {
      return res.status(409).json({ message: "No Meal Found" });
    }

    // Remove the meal from mealItems
    userCart.mealItems = userCart.mealItems.filter(
      (meal) => meal.mealId._id != req.params.id
    );

    // Recalculate the totalAmount after removal
    const newTotalAmount = userCart.mealItems.reduce((acc, item) => {
      return acc + item.mealId.price * item.quantity;
    }, 0);

    // Update the totalAmount in the cart
    userCart.totalAmount = newTotalAmount;

    // Save the updated cart
    await userCart.save();

    return res.status(200).json({ message: "Meal Removed from Cart", cart: userCart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const clearCart = async (req, res) => {
  const userCart = await cartModel.findOneAndDelete({
    userId: req.user._id,
  });
  if (userCart) {
    res.status(200).json({ messgae: "Cart Removed", userCart });
  } else {
    res.status(409).json({ messgae: "No Cart Found" });
  }
};

const checkOut = async (req, res) => {
  const userCart = await cartModel.findOne({ userId: req.user._id });
  if (!userCart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const shippingDetails = req.body;

  const order = new orderModel({
    userId: req.user._id,
    mealItems: userCart.mealItems,
    shippingDetails: shippingDetails,
  });

  await order.save();
  await userCart.deleteOne({ userId: req.user._id }); // Clear cart after checkout
  res.status(200).json({ message: "Order placed successfully", order });
};

export { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart, checkOut };
