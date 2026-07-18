import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'

import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";

// Import your routes
// import userRoutes from "./routes/userRoutes.js";

// Import Clerk only if you use it
// import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // Apply Clerk middleware globally

app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ Make Inngest PUBLIC
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// 👇 Apply Clerk AFTER the Inngest route
// app.use(clerkMiddleware());

// Your API routes
// app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});