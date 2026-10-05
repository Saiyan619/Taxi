import dotenv from "dotenv";
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors";
import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import AIRoutes from "./routes/AIRoute.js"

dotenv.config();

const PORT = Number(process.env.PORT || 5000);
const configuredFrontendUrls = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const allowedFrontendUrls = [
  "http://localhost:5173",
  "https://taxi-nine-pi.vercel.app",
  ...configuredFrontendUrls,
];

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedFrontendUrls.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", AIRoutes);

app.get("/health", (_req, res) => {
  try {
    return res.status(200).json({ status: "ok", message: "API is healthy" });
  } catch {
    return res.status(500).json({ status: "fail", message: "API health check failed" });
  }
});

app.listen(PORT);