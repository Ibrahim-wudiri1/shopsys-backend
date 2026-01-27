import { Router } from "express";
import { salesController } from "./sales.controller.js";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";

const router = Router();

router.post("/", auth, tenantGuard, salesController.create);
router.get("/", auth, tenantGuard, salesController.list);
router.get("/:id", auth, tenantGuard, salesController.getOne);

export default router;
