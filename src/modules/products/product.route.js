import { Router } from "express";
import { productController } from "./product.controller.js";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";

const router = Router();

router.post("/", auth, tenantGuard, productController.create);
router.get("/", auth, tenantGuard, productController.list);
router.get("/:id", auth, tenantGuard, productController.getOne);
router.put("/:id", auth, tenantGuard, productController.update);
router.delete("/:id", auth, tenantGuard, productController.delete);

export default router;