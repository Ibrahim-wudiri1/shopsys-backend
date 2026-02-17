import { salesService } from "./sales.service.js";

export const salesController = {
  create: async (req, res, next) => {
    try {
      const { shopId, items, paymentType } = req.body;
      const result = await salesService.createSale(
        req.user.tenantId,
        shopId,
        req.user.id,
        items,
        paymentType
      );
      console.log(result);
      res.status(201).json(result);
    } catch (err) {
      console.log(`Error: ${err}`);
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
      console.log(sales);
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
