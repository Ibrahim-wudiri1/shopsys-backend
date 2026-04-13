import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { tenantGuard } from "../../middleware/tenantGuard.js";
import { userShopController } from "./userShop.controller.js";

const router = Router();

router.post("/:id/users", auth, tenantGuard, userShopController.assign);
router.get("/:id/users", auth, tenantGuard, userShopController.getUsers);

export default router;