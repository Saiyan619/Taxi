import { Router } from "express";
import { billingStatus, checkout, portal, webhook } from "../controllers/paymentController.js";
import { jwtMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/webhook", webhook);
router.post("/checkout", jwtMiddleware, checkout);
router.post("/portal", jwtMiddleware, portal);
router.get("/status", jwtMiddleware, billingStatus);
export default router;
