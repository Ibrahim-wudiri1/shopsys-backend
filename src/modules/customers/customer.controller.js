import { customerService } from "./customer.service.js";

export const customerController = {
  create: async (req, res, next) => {
    try {
      const customer = await customerService.createCustomer(req.user.tenantId, req.body);
      console.log("Customer data: ", customer);
      res.status(201).json(customer);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const customers = await customerService.listCustomers(req.user.tenantId);
      res.json(customers);
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const customer = await customerService.getCustomerById(req.user.tenantId, req.params.id);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const customer = await customerService.updateCustomer(
        req.user.tenantId,
        req.params.id,
        req.body
      );
      res.json(customer);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const result = await customerService.deleteCustomer(req.user.tenantId, req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  addPoints: async (req, res, next) => {
    try {
      const { points } = req.body;
      const updated = await customerService.addLoyaltyPoints(
        req.user.tenantId,
        req.params.id,
        Number(points)
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
};
