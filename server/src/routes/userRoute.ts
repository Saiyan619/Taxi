import { Router } from "express";
import { jwtMiddleware } from "../middleware/authMiddleware.js";
import { getUser, updateUser } from "../controllers/userController.js";

const router = Router();

router.get("/me", jwtMiddleware, getUser);
router.patch("/me", jwtMiddleware, updateUser);

export default router;