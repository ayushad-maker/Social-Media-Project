import express from "express";
import { protect } from "../middleware/auth.js";
import {
  discoveryUsers,
  followUser,
  getUpdatedUserData,
  getUserData,
  UnfollowUser,
} from "../controllers/userControllers.js";
import { upload } from "../config/multer.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, UnfollowUser);
userRouter.post(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  getUpdatedUserData,
);
userRouter.post("/discover", protect, discoveryUsers);

export default userRouter;
