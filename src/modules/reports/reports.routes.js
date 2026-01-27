import { Router } from "express";
import { reportsController } from "./reports.controller.js";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";

const router = Router();

router.get("/sales-summary", auth, tenantGuard, reportsController.salesSummary);
router.get("/top-products", auth, tenantGuard, reportsController.topProducts);
router.get("/low-stock", auth, tenantGuard, reportsController.lowStock);
router.get("/supplier-activity", auth, tenantGuard, reportsController.supplierActivity);
router.get("/overview", auth, tenantGuard, reportsController.overview);

export default router;
