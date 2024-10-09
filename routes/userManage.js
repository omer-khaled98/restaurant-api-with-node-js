import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAllow from "../middlewares/isAllow.js";
import {
  editUser,
  getAllUsers,
  getUser,
  removeUser,
} from "../controllers/userManage.js";

const userMangeRoute = express.Router();
userMangeRoute.use(authMiddleware);

userMangeRoute.get("/users", isAllow("admin"), getAllUsers);
userMangeRoute.get("/users/:id", isAllow("admin"), getUser);
userMangeRoute.put("/users/:id", editUser);
userMangeRoute.delete("/users/:id", isAllow("admin"), removeUser);

export default userMangeRoute;
