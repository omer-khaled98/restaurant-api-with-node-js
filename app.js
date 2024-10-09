import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import mealRoutes from "./routes/mealRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import userRoutes from "./routes/user.js";
import orderRoute from "./routes/orderRoutes.js";
import userMangeRoute from "./routes/userManage.js";
import cartRoute from "./routes/cartRoutes.js";

import repassword from "./routes/repasswordRoutes.js";
import router from "./routes/stripe.js";
// Load environment variables
dotenv.config();

const app = express();

// Connect to the database
connectDB();

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:4200",
  "http://localhost:5173",
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
// app.use("/webhook", express.raw({ type: "application/json" }));

app.use("/api", router);
app.use(express.json());

// Routes
app.use("/api", repassword);

app.use("/api", userRoutes);
app.use("/api", mealRoutes);
app.use("/api", reservationRoutes);
app.use("/api", orderRoute);
app.use("/api", userMangeRoute);
app.use("/api", cartRoute);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
