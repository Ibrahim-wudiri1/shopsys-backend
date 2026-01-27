import { salesService } from "./sales.service.js";

export const salesController = {
  create: async (req, res, next) => {
    try {
      const { shopId, items, paymentMethod } = req.body;
      const result = await salesService.createSale(
        req.user.tenantId,
        shopId,
        req.user.id,
        items,
        paymentMethod
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const { shopId, startDate, endDate } = req.query;
      const sales = await salesService.getSales(req.user.tenantId, shopId, {
        startDate,
        endDate,
      });
      res.json(sales);
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const sale = await salesService.getSaleById(req.user.tenantId, req.params.id);
      res.json(sale);
    } catch (err) {
      next(err);
    }
  },
};
