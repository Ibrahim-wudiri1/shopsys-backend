import { Router } from "express";
import { productController } from "./product.controller.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";
import { auth } from "../../middleware/auth.js";
import { authorize } from "../../middleware/authorize.js";
const router = Router();

router.post("/", auth, authorize("SUPER_ADMIN", "TENANT_ADMIN"), tenantGuard, productController.create);
router.get("/", auth, tenantGuard, productController.list);
router.get("/:id", auth, tenantGuard, productController.getOne);
router.put("/:id", auth, authorize("SUPER_ADMIN", "TENANT_ADMIN"), tenantGuard, productController.update);
router.delete("/:id", auth, authorize("SUPER_ADMIN", "TENANT_ADMIN"), tenantGuard, productController.delete);

export default router;