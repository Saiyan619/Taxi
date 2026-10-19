import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors";
import { allowedFrontendUrls as configuredFrontendUrls } from "./config/env.js";
import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import AIRoutes from "./routes/AIRoute.js"
import paymentRoutes from "./routes/paymentRoute.js"

const PORT = Number(process.env.PORT || 5000);

// Always permit the local Vite frontend for development. The validated
// configured origins are added for production or other trusted deployments.
const allowedFrontendUrls = [
  "http://localhost:5173",
  ...configuredFrontendUrls,
];

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Requests without an Origin header are commonly server-to-server calls,
    // so they are allowed while browser origins are restricted to this list.
    if (!origin || allowedFrontendUrls.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));

app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", AIRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/health", (_req, res) => {
  try {
    return res.status(200).json({ status: "ok", message: "API is healthy" });
  } catch {
    return res.status(500).json({ status: "fail", message: "API health check failed" });
  }
});

app.listen(PORT);