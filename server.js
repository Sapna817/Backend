import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import signupRoutes from "./routes/signupRoute.js";
import loginRoutes from "./routes/loginRoute.js";
import contactRoutes from "./routes/contactRoute.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRoutes from "./routes/doctorsRoute.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads (for profile pics)
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/user_profiles", express.static("uploads")); // Optional alias

// Routes
app.use("/api", signupRoutes);
app.use("/api", loginRoutes);
app.use("/api", contactRoutes);
app.use("/api", bookingRoutes);
app.use("/api", adminRouter);
app.use("/api", doctorRoutes);
app.use("/api/user", userRoutes);

// Test
app.get("/", (req, res) => {
  res.send("🚀 Backend is live");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
