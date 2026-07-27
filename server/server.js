import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";

import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import userRouter from "./routes/userRoutes.js";
import User from "./models/User.js";
import postRouter from "./routes/postRoutes.js";
import StoryRouter from "./routes/storyRoutes.js";

dotenv.config();

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/stories",StoryRouter)
app.get("/create-test-user", async (req, res) => {
  try {
    const user = await User.create({
      _id: "test123",
      email: "test@test.com",
      full_name: "Test User",
      username: "testuser",
    });

    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
