import dotenv from "dotenv";
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors";
import authRoutes from "./src/routes/authRoute"
import userRoutes from "./src/routes/userRoute"
import AIRoutes from "./src/routes/AIRoute"
dotenv.config();
let PORT = process.env.PORT;

let app = express();

app.use(cors({
  origin: "http://localhost:5173", // your frontend's actual origin
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", AIRoutes);

app.listen(PORT, () => {
    console.log(`listening on the port:${PORT}`)
});

