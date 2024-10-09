import orderModel from "../models/Order.js";
import userModel from "../models/User.js";
import Meal from "../models/Meal.js";

const orderMeal = async (req, res) => {
  const userId = req.user._id;
  const { mealId } = req.params;
  const { quantity = 1 } = req.body;

  try {
    // Fetch the meal price from Meal model
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Check if there is an existing order for the user that is still pending
    let userOrder = await orderModel.findOne({
      userId,
      status: "pending",
    });

    if (userOrder) {
      const mealIndex = userOrder.mealItems.findIndex(
        (item) => item.mealId.toString() === mealId
      );

      if (mealIndex !== -1) {
        // Update quantity if the meal is already in the order
        userOrder.mealItems[mealIndex].quantity += quantity;
      } else {
        // Add a new meal to the order
        userOrder.mealItems.push({ mealId, quantity });
      }
    } else {
      // Create a new order
      userOrder = new orderModel({
        userId,
        mealItems: [{ mealId, quantity }],
        shippingDetails: {
          address: req.body.address,
          city: req.body.city,
          postalCode: req.body.postalCode,
          comment: req.body.comment,
        },
      });
    }

    // Recalculate the totalPrice
    let totalPrice = 0;
    for (const item of userOrder.mealItems) {
      const meal = await Meal.findById(item.mealId);
      totalPrice += meal.price * item.quantity;
    }

    userOrder.totalPrice = totalPrice;
    await userOrder.save();

    if (!userOrder._id) {
      // Link the order to the user if it's a new order
      await userModel.findByIdAndUpdate(userId, {
        $push: { orders: userOrder._id },
      });
    }

    return res.status(userOrder._id ? 200 : 201).json({
      message: userOrder._id
        ? "Order updated successfully"
        : "Order placed successfully",
      order: userOrder,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
const updateAddress = async (req, res) => {
  let order = await orderModel.findOneAndUpdate(
    {
      _id: req.params.orderId,
      userId: req.user._id,
      status: "pending",
    },
    { shippingDetails: req.body },
    { new: true }
  );
  if (order) {
    res.status(200).json({ messgae: "Order Address Updated", order });
  } else {
    res.status(409).json({ messgae: "This Action Can Not Be Complete" });
  }
};

const cancelOrder = async (req, res) => {
  let order = await orderModel.findOneAndDelete({
    _id: req.params.orderId,
    userId: req.user._id,
    status: "pending",
  });
  if (order) {
    res.status(200).json({ messgae: "Order Canceled", order });
  } else {
    res.status(409).json({ messgae: "This Action Can Not Be Complete" });
  }
};

const removeMeal = async (req, res) => {
  let order = await orderModel.findOne({
    userId: req.user._id,
    status: "pending",
  });
  if (order) {
    order.mealItems = order.mealItems.filter(
      (meal) => meal.mealId != req.params.mealId
    );
    await order.save();
    res.status(200).json({ messgae: "Meal Removed", order });

    // remove the whole order if it is last meal in the order
    if (order.mealItems.length == 0) {
      await orderModel.findByIdAndDelete(req.params.orderId);
    }
  } else {
    res.status(409).json({ messgae: "This Action Can Not Be Complete", order });
  }
};

const updateOrderStatus = async (req, res) => {
  // const userId = req.body.userId;
  const newOrderStatus = req.body.status;
  let order = await orderModel.findOneAndUpdate(
    { _id: req.params.orderId },
    { status: newOrderStatus },
    { new: true }
  );

  if (order) {
    res.status(200).json({ message: "order Status Updated", order });
  } else {
    res.status(409).json({ message: "This Action Can Not Be Complete" });
  }
};

const getAllOrders = async (req, res) => {
  if (req.user.role == "admin") {
    // if is an admin it will return all users orders
    const allOrders = await orderModel
      .find()
      .populate({
        path: "mealItems.mealId",
        select: "name price description",
      })
      .populate({
        path: "userId",
        select: "userName",
      });
    if (allOrders && allOrders.length > 0) {
      res.status(200).json({ message: "all users Orders fetched", allOrders });
    } else {
      res.status(404).json({ message: "there are no orders yet!" });
    }
  } else if (req.user.role == "user") {
    // if is a user it will return all its own orders
    const allOrders = await orderModel.find({ userId: req.user._id }).populate({
      path: "mealItems.mealId",
      select: "name price description",
    });
    if (allOrders && allOrders.length > 0) {
      res.status(200).json({ message: "all Orders fetched", allOrders });
    } else {
      res.status(404).json({ message: "there are no orders yet!" });
    }
  }
};

const getOrder = async (req, res) => {
  if (req.user.role == "admin") {
    // if is an admin it will return all users orders
    const order = await orderModel
      .findById(req.params.orderId)
      .populate({
        path: "userId",
        select: "userName",
      })
      .populate({
        path: "mealItems.mealId",
        select: "name",
      });
    if (order) {
      res.status(200).json({ message: "Order fetched", order });
    } else {
      res.status(404).json({ message: "there are no order yet!" });
    }
  } else if (req.user.role == "user") {
    // if is a user it will return all its own orders
    const order = await orderModel.find({
      _id: req.params.orderId,
      userId: req.user._id,
    });

    if (order) {
      res.status(200).json({ message: "order fetched", order });
    } else {
      res.status(404).json({ message: "there are no order!" });
    }
  }
};

export {
  orderMeal,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  removeMeal,
  getOrder,
  updateAddress,
};

// import orderModel from "../models/Order.js";
// import userModel from "../models/User.js";
// import Meal from "../models/Meal.js";
// const orderMeal = async (req, res) => {
//   const userId = req.user._id;
//   const { mealId } = req.params;
//   const { quantity = 1 } = req.body;

//   try {
//     // Fetch the meal price from Meal model
//     const meal = await Meal.findById(mealId);
//     if (!meal) {
//       return res.status(404).json({ message: "Meal not found" });
//     }

//     // Check if there is an existing order for the user that is still pending
//     let userOrder = await orderModel.findOne({
//       userId,
//       status: "pending",
//     });

//     if (userOrder) {
//       const mealIndex = userOrder.mealItems.findIndex(
//         (item) => item.mealId.toString() === mealId
//       );

//       if (mealIndex !== -1) {
//         // Update quantity if the meal is already in the order
//         userOrder.mealItems[mealIndex].quantity += quantity;
//       } else {
//         // Add a new meal to the order
//         userOrder.mealItems.push({ mealId, quantity });
//       }
//     } else {
//       // Create a new order
//       userOrder = new orderModel({
//         userId,
//         mealItems: [{ mealId, quantity }],
//         shippingDetails: {
//           address: req.body.address,
//           city: req.body.city,
//           postalCode: req.body.postalCode,
//           comment: req.body.comment,
//         },
//       });
//     }

//     // Recalculate the totalPrice
//     let totalPrice = 0;
//     for (const item of userOrder.mealItems) {
//       const meal = await Meal.findById(item.mealId);
//       totalPrice += meal.price * item.quantity;
//     }

//     userOrder.totalPrice = totalPrice;
//     await userOrder.save();

//     if (!userOrder._id) {
//       // Link the order to the user if it's a new order
//       await userModel.findByIdAndUpdate(userId, {
//         $push: { orders: userOrder._id },
//       });
//     }

//     return res.status(userOrder._id ? 200 : 201).json({
//       message: userOrder._id
//         ? "Order updated successfully"
//         : "Order placed successfully",
//       order: userOrder,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// const updateAddress = async (req, res) => {
//   let order = await orderModel.findOneAndUpdate(
//     {
//       _id: req.params.orderId,
//       userId: req.user._id,
//       status: "pending",
//     },
//     { shippingDetails: req.body },
//     { new: true }
//   );
//   if (order) {
//     res.status(200).json({ messgae: "Order Address Updated", order });
//   } else {
//     res.status(409).json({ messgae: "This Action Can Not Be Complete" });
//   }
// };

// const cancelOrder = async (req, res) => {
//   let order = await orderModel.findOneAndDelete({
//     _id: req.params.orderId,
//     userId: req.user._id,
//     status: "pending",
//   });
//   if (order) {
//     res.status(200).json({ messgae: "Order Canceled", order });
//   } else {
//     res.status(409).json({ messgae: "This Action Can Not Be Complete" });
//   }
// };

// const removeMeal = async (req, res) => {
//   let order = await orderModel.findOne({
//     userId: req.user._id,
//     status: "pending",
//   });
//   if (order) {
//     order.mealItems = order.mealItems.filter(
//       (meal) => meal.mealId != req.params.mealId
//     );
//     await order.save();
//     res.status(200).json({ messgae: "Meal Removed", order });

//     // remove the whole order if it is last meal in the order
//     if (order.mealItems.length == 0) {
//       await orderModel.findByIdAndDelete(req.params.orderId);
//     }
//   } else {
//     res.status(409).json({ messgae: "This Action Can Not Be Complete", order });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   const userId = req.body.userId;
//   const newOrderStatus = req.body.status;
//   let order = await orderModel.findOneAndUpdate(
//     { _id: req.params.orderId, userId },
//     { status: newOrderStatus },
//     { new: true }
//   );

//   if (order) {
//     res.status(200).json({ message: "order Status Updated", order });
//   } else {
//     res.status(409).json({ message: "This Action Can Not Be Complete" });
//   }
// };

// const getAllOrders = async (req, res) => {
//   if (req.user.role == "admin") {
//     // if is an admin it will return all users orders
//     const allOrders = await orderModel.find();

//     if (allOrders && allOrders.length > 0) {
//       res.status(200).json({ message: "all users Orders fetched", allOrders });
//     } else {
//       res.status(404).json({ message: "there are no orders yet!" });
//     }
//   } else if (req.user.role == "user") {
//     // if is a user it will return all its own orders
//     const allOrders = await orderModel
//       .find({ userId: req.user._id })
//       .populate({ path: "mealItems.mealId", select: "name price" })
//       .populate({ path: "userId", select: "userName" });
//     if (allOrders && allOrders.length > 0) {
//       res.status(200).json({ message: "all Orders fetched", allOrders });
//     } else {
//       res.status(404).json({ message: "there are no orders yet!" });
//     }
//   }
// };

// const getOrder = async (req, res) => {
//   if (req.user.role == "admin") {
//     // if is an admin it will return all users orders
//     const order = await orderModel.findById(req.params.orderId);
//     if (order && order.length > 0) {
//       res.status(200).json({ message: "all users Orders fetched", order });
//     } else {
//       res.status(404).json({ message: "there are no order yet!" });
//     }
//   } else if (req.user.role == "user") {
//     // if is a user it will return all its own orders
//     const order = await orderModel.find({
//       _id: req.params.orderId,
//       userId: req.user._id,
//     });
//     if (order && order.length > 0) {
//       res.status(200).json({ message: "order fetched", order });
//     } else {
//       res.status(404).json({ message: "there are no order!" });
//     }
//   }
// };

// export {
//   orderMeal,
//   cancelOrder,
//   updateOrderStatus,
//   getAllOrders,
//   removeMeal,
//   getOrder,
//   updateAddress,
// };
