import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";
import {auth} from "../../middleware/auth.js";
import {tenantGuard} from "../../middleware/tenantGuard.js";

const router = Router();

router.get("/", auth, tenantGuard, inventoryController.list);
router.post("/stock-in", auth, tenantGuard, inventoryController.stockIn);
router.post("/stock-out", auth, tenantGuard, inventoryController.stockOut);
router.get("/movements/:productId", auth, tenantGuard, inventoryController.movementHistory);

export default router;