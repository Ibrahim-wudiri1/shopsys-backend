import { Router } from "express";
import { supplierController } from "./supplier.controller.js";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";

const router = Router();

// Supplier CRUD
router.post("/", auth, tenantGuard, supplierController.create);
router.get("/", auth, tenantGuard, supplierController.list);
router.get("/:id", auth, tenantGuard, supplierController.getOne);
router.put("/:id", auth, tenantGuard, supplierController.update);
router.delete("/:id", auth, tenantGuard, supplierController.remove);

// Purchase Orders
router.post("/orders", auth, tenantGuard, supplierController.createPO);
router.post("/orders/:id/receive", auth, tenantGuard, supplierController.receivePO);
router.get("/orders", auth, tenantGuard, supplierController.listPOs);

export default router;
