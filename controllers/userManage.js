import orderModel from "../models/Order.js";
import userModel from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const getAllUsers = async (req, res) => {
  const allUsers = await userModel.find();

  if (allUsers) {
    res.status(200).json({ message: "Users Found", allUsers });
  } else {
    res.status(404).json({ message: "There Is No User" });
  }
};

const getUser = async (req, res) => {
  const User = await userModel.findById(req.params.id);
  if (User) {
    res.status(200).json({ message: "User Found", User });
  } else {
    res.status(404).json({ message: "There Is No User" });
  }
};

// const editUser = async (req, res) => {
//   const User = await userModel.findById(req.params.id);
//   // res.json({ user: User });
//   if (User) {
//     const updatedUser = await userModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     const token = jwt.sign(updatedUser, process.env.JWT_SECRET, {
//       expiresIn: "24h",
//     });
//     res.status(200).json({ message: "User Updated", token: token });
//   } else {
//     res.status(404).json({ message: "There Is No User" });
//   }
// };
const editUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "There Is No User" });
    }

    // تحقق من وجود بيانات في req.body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // إذا كانت هناك حاجة لإعادة البيانات المحدثة مع التوكن
    const token = jwt.sign(
      { updatedUser: updatedUser },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res
      .status(200)
      .json({ message: "User Updated", token: token, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const removeUser = async (req, res) => {
  const User = await userModel.findById(req.params.id);
  if (User) {
    const deleteddUser = await userModel.findByIdAndDelete(req.params.id);
    await orderModel.deleteMany({ userId: req.params.id });
    res.status(200).json({ message: "User Deleted", deleteddUser });
  } else {
    res.status(404).json({ message: "There Is No User" });
  }
};

export { getAllUsers, getUser, editUser, removeUser };
