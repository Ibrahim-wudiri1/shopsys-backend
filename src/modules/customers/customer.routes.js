import { Router } from "express";
import { customerController } from "./customer.controller.js";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";

const router = Router();

router.post("/", auth, tenantGuard, customerController.create);
router.get("/", auth, tenantGuard, customerController.list);
router.get("/:id", auth, tenantGuard, customerController.getOne);
router.put("/:id", auth, tenantGuard, customerController.update);
router.delete("/:id", auth, tenantGuard, customerController.remove);

// Loyalty points
router.post("/:id/points", auth, tenantGuard, customerController.addPoints);

export default router;
