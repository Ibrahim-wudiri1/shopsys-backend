import { supplierService } from "./supplier.service.js";
import { purchaseOrderService } from "./purchaseOrder.service.js";

export const supplierController = {
  // Supplier CRUD
  create: async (req, res, next) => {
    try {
      const supplier = await supplierService.createSupplier(req.user.tenantId, req.body);
      res.status(201).json(supplier);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const suppliers = await supplierService.listSuppliers(req.user.tenantId);
      res.json(suppliers);
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const supplier = await supplierService.getSupplierById(req.user.tenantId, req.params.id);
      res.json(supplier);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const supplier = await supplierService.updateSupplier(
        req.user.tenantId,
        req.params.id,
        req.body
      );
      res.json(supplier);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const result = await supplierService.deleteSupplier(req.user.tenantId, req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // Purchase orders
  createPO: async (req, res, next) => {
    try {
      const { supplierId, shopId, items } = req.body;
      const order = await purchaseOrderService.createPurchaseOrder(
        req.user.tenantId,
        supplierId,
        shopId,
        items,
        req.user.id
      );
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  },

  receivePO: async (req, res, next) => {
    try {
      const order = await purchaseOrderService.receiveOrder(
        req.user.tenantId,
        req.params.id,
        req.user.id
      );
      res.json(order);
    } catch (err) {
      next(err);
    }
  },

  listPOs: async (req, res, next) => {
    try {
      const { supplierId } = req.query;
      const orders = await purchaseOrderService.listPurchaseOrders(req.user.tenantId, supplierId);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },
};
