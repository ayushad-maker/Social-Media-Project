import express from "express";
import {
  getChatMessages,
  getRecentMessages,
  sendMessage,
  sseController,
} from "../controllers/messageControllers.js";
import { upload } from "../config/multer.js";
import { protect } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.get("/:userId", sseController);
messageRouter.post("/send", upload.single("image"), protect, sendMessage);
messageRouter.post("/get", protect, getChatMessages);

export default messageRouter;
