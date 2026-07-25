import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import teamRoutes from "./routes/teamRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import customerRoutes from "./routes/customerRoutes";
import brandRoutes from "./routes/brandRoutes";
import siteSettingsRoutes from "./routes/siteSettingsRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { syncImages } from "./services/imageSync";

const app = express();
const PORT = process.env.PORT || 5000;

syncImages().catch((err) => {
  console.error("Image sync failed:", err);
});

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/settings", siteSettingsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`MS10Shop Backend running on port ${PORT}`);
});

export default app;
