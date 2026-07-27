import express from "express";
import { protect } from "../middleware/auth.js";
import {
  acceptConnectionRequest,
  discoveryUsers,
  followUser,
  getUpdatedUserData,
  getUserConnections,
  getUserData,
  getUserProfile,
  sendConnectionsRequest,
  UnfollowUser,
} from "../controllers/userControllers.js";
import { upload } from "../config/multer.js";
import { getRecentMessages } from "../controllers/messageControllers.js";

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
userRouter.get("/connections", protect, getUserConnections);
userRouter.post("/connect", protect, sendConnectionsRequest);
userRouter.post('"/accept', protect, acceptConnectionRequest);
userRouter.post("/profiles",getUserProfile);
userRouter.get("/recent-messages",protect,getRecentMessages);

export default userRouter;
