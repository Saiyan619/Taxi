import { Router } from "express";
import { aiTextConverter, deleteAllArticulations, deleteArticulation, getArticulations } from "../controllers/aiController.js";
import { jwtMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/text-articulate", jwtMiddleware, aiTextConverter);
router.get("/getArticulations", jwtMiddleware, getArticulations);
router.delete("/deleteArticulations/:id", jwtMiddleware, deleteArticulation);
router.delete("/deleteAllArticulations", jwtMiddleware, deleteAllArticulations);

export default router;