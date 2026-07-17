import expess from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { inngest,functions } from "./inngest/index.js";
import { serve } from "inngest/express";

const app = expess();

dotenv.config();

await connectDB();

app.use(cors());
app.use(expess.json());



app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});