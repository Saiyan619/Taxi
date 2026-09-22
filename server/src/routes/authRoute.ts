import { Router } from "express";
import { loginUser, logout, refreshToken, registerUser, requirePasswordReset, ResetForgotPassword, verifyEmail } from "../controllers/authController.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/verify", verifyEmail);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post('/logout', logout);
router.post("/requirePassReset", requirePasswordReset);
router.post("/resetPassword/:token", ResetForgotPassword);

export default router;