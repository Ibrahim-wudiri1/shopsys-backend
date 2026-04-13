import { Router } from "express";
import { createCheckoutSession, initializePayment, createBillingPortal } from "./billing.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();
router.post("/paystack/initialize", auth, initializePayment);
router.post("/checkout", auth, createCheckoutSession);
router.post("/portal", auth, createBillingPortal);

export default router;
