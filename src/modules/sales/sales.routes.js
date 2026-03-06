import { Router } from "express";
import { salesController } from "./sales.controller.js";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

router.post("/", auth, authorize("CASHIER", "TENANT_ADMIN"), tenantGuard, salesController.create);
router.get("/", auth, authorize("CASHIER", "TENANT_ADMIN"), tenantGuard, salesController.list);
router.get("/:id", auth, authorize("CASHIER", "TENANT_ADMIN"), tenantGuard, salesController.getOne);

export default router;
