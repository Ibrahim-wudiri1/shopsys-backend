import { Router } from "express";
import { shopController } from "./shop.controller.js";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";

const router = Router();

router.post("/", auth, tenantGuard, shopController.create);
router.get("/", auth, tenantGuard, shopController.list);
router.get("/:id", auth, tenantGuard, shopController.getOne);
router.put("/:id", auth, tenantGuard, shopController.update);
router.delete("/:id", auth, tenantGuard, shopController.remove);

export default router;