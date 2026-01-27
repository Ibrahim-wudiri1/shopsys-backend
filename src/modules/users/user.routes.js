import { Router } from "express";
import { userController } from "./user.controller.js";
import {auth} from "../../middleware/auth.js";
import {tenantGuard} from "../../middleware/tenantGuard.js";

const router = Router();

router.post("/", auth, tenantGuard, userController.create);
router.get("/", auth, tenantGuard, userController.list);
router.get("/:id", auth, tenantGuard, userController.getOne);
router.put("/:id", auth, tenantGuard, userController.update);
router.delete("/:id", auth, tenantGuard, userController.remove);

export default router;