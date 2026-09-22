import { Router } from "express";
import { aiTextConverter } from "../controllers/aiController.js";
import { jwtMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/text-articulate", jwtMiddleware, aiTextConverter);

export default router;