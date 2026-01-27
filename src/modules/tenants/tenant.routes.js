import { Router } from "express";
import { tenantController } from "./tenant.controller.js";
import { auth } from "../../middleware/auth.js";
import {isSuperAdmin} from "../../middleware/isSuperAdmin.js";

const router = Router();
// only Super Admin can get all tenants
router.get("/", auth, isSuperAdmin, tenantController.listTenants);

// tenant Owner/ Admin operations
router.get("/me", auth, tenantController.getTenant);
router.put("/me", auth, tenantController.updateTenant);
router.delete("/me", auth, tenantController.deleteTenant);

export default router;