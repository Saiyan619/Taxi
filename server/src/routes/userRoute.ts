import { Router } from "express";
import { jwtMiddleware } from "../middleware/authMiddleware.js";
import { getUser } from "../controllers/userController.js";

const router = Router();

router.get("/me", jwtMiddleware, getUser);

export default router;