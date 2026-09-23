import { Router } from "express";
import { aiTextConverter, getArticulations } from "../controllers/aiController.js";
import { jwtMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/text-articulate", jwtMiddleware, aiTextConverter);
router.get("/getArticulations", jwtMiddleware, getArticulations);

export default router;