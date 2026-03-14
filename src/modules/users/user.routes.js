import { Router } from "express";
import { userController } from "./user.controller.js";
import {auth} from "../../middleware/auth.js";
import {isAdmin} from "../../middleware/isAdmin.js";
import {tenantGuard} from "../../middleware/tenantGuard.js";
import {authorize} from "../../middleware/authorize.js";
const router = Router();

router.post("/", auth, authorize("TENANT_ADMIN"), tenantGuard, userController.create);
router.get("/", auth, authorize("TENANT_ADMIN","MANAGER"), tenantGuard, userController.list);
router.get("/:id", auth, authorize("TENANT_ADMIN","MANAGER"), tenantGuard, userController.getOne);
router.put("/:id", auth, authorize("TENANT_ADMIN","MANAGER"), tenantGuard, userController.update);
router.delete("/:id", auth, authorize("TENANT_ADMIN"), tenantGuard, userController.remove);

export default router;