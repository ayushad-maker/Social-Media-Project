import express from "express";
import { addUserStory, getStory } from "../controllers/storyControllers.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

const StoryRouter = express.Router();

StoryRouter.post("/create", upload.single("media"), protect, addUserStory);
StoryRouter.get("/get", protect, getStory);


export default StoryRouter;