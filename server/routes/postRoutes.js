import { upload } from "../config/multer.js";
import { addPost, getPost, likePost } from "../controllers/postControllers.js";
import { protect } from "../middleware/auth.js";
import express from "express"

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), protect, addPost);
postRouter.get("/feed", protect, getPost);
postRouter.post("/like", protect, likePost);

export default postRouter;
