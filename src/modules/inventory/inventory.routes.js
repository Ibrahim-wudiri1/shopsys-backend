import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";
import {auth} from "../../middleware/auth.js";
import {tenantGuard} from "../../middleware/tenantGuard.js";
import {authorize} from "../../middleware/authorize.js";

const router = Router();

router.get("/", auth, authorize("STAFF", "TENANT_ADMIN"), tenantGuard, inventoryController.list);
router.post("/stock-in", auth, authorize("STAFF", "TENANT_ADMIN"), tenantGuard, inventoryController.stockIn);
router.post("/stock-out", auth, authorize("STAFF", "TENANT_ADMIN"), tenantGuard, inventoryController.stockOut);
router.get("/movements/:productId", auth, authorize("STAFF", "TENANT_ADMIN"), tenantGuard, inventoryController.movementHistory);

export default router;