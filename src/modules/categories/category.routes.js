import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";
import { authorize } from "../../middleware/authorize.js";

const router = Router();

router.post("/", auth, authorize("TENANT_ADMIN", "MANAGER"), tenantGuard, categoryController.create);
router.get("/", auth, authorize("TENANT_ADMIN", "MANAGER"), tenantGuard, categoryController.list);
router.get("/:id", auth, authorize("TENANT_ADMIN", "MANAGER"), tenantGuard, categoryController.getOne);
router.put("/:id", auth, authorize("TENANT_ADMIN", "MANAGER"), tenantGuard, categoryController.update);
router.delete("/:id", auth, authorize("TENANT_ADMIN", "MANAGER"), tenantGuard, categoryController.remove);

// Loyalty points
// router.post("/:id/points", auth, tenantGuard, customerController.addPoints);

export default router;
