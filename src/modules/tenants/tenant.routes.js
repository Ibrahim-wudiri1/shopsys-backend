import { Router } from "express";
import { tenantController } from "./tenant.controller.js";
import { auth } from "../../middleware/auth.js";
import {isSuperAdmin} from "../../middleware/isSuperAdmin.js";
import {isAdmin} from "../../middleware/isAdmin.js";

const router = Router();
// only Super Admin can get all tenants
router.get("/", auth, isSuperAdmin, tenantController.listTenants);
router.post("/create", auth, isSuperAdmin, tenantController.create);
router.delete("/:id", auth, isSuperAdmin, tenantController.deleteTenant);

// tenant Owner/ Admin operations
router.get("/me", auth, isAdmin, tenantController.getTenant);
router.put("/me", auth, isAdmin, tenantController.updateTenant);

export default router;