import dotenv from "dotenv";
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors";
import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import AIRoutes from "./routes/AIRoute.js"

dotenv.config();

let PORT = process.env.PORT;
let FRONTEND_URL = process.env.FRONTEND_URL;

let app = express();

app.use(cors({
  // origin: "http://localhost:5173",
  origin: FRONTEND_URL,
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

app.listen(Number(PORT), () => console.log(`Running on ${PORT}`));