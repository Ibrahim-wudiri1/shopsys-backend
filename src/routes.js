import {Router} from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import tenantRoutes from "./modules/tenants/tenant.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import shopRoutes from "./modules/shops/shop.routes.js";
import pruductRoutes from "./modules/products/product.route.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import salesRoutes from "./modules/sales/sales.routes.js";
import supplierRoutes from "./modules/suppliers/supplier.routes.js";
import customerRoutes from "./modules/customers/customer.routes.js";
import reportsRoutes from "./modules/reports/reports.routes.js";
import categoriesRoutes from "./modules/categories/category.routes.js";
import userShopRoutes from "./modules/userShop/userShop.routes.js";
import billingRoutes from "./modules/billing/billing.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tenant", tenantRoutes);
router.use("/users", userRoutes);
router.use("/shops", shopRoutes);
router.use("/products", pruductRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/sales", salesRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/customers", customerRoutes);
router.use("/reports", reportsRoutes);
router.use("/category", categoriesRoutes);
router.use("/shops", userShopRoutes);

router.use("/billing", billingRoutes);

export default router;