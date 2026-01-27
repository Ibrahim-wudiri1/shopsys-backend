import { Router } from "express";
import { userController } from "./user.controller.js";
import {auth} from "../../middleware/auth.js";
import {isAdmin} from "../../middleware/isAdmin.js";
import {tenantGuard} from "../../middleware/tenantGuard.js";

const router = Router();

router.post("/", auth, isAdmin, tenantGuard, userController.create);
router.get("/", auth, isAdmin, tenantGuard, userController.list);
router.get("/:id", auth, isAdmin, tenantGuard, userController.getOne);
router.put("/:id", auth, isAdmin, tenantGuard, userController.update);
router.delete("/:id", auth, isAdmin, tenantGuard, userController.remove);

export default router;