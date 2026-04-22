import { salesService } from "./sales.service.js";

export const salesController = {
  create: async (req, res, next) => {
    try {
      const { shopId, items, paymentType } = req.body;

      // Validate required fields
      if (!shopId) {
        return res.status(400).json({ message: "Shop ID is required" });
      }
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Items are required" });
      }
      if (!paymentType) {
        return res.status(400).json({ message: "Payment type is required" });
      }

      const result = await salesService.createSale(
        req.user.tenantId,
        shopId,
        req.user.id,
        items,
        paymentType
      );

      res.status(201).json({
        message: "Sale completed successfully",
        saleId: result.saleId,
        totalAmount: result.totalAmount,
      });
    } catch (err) {
      console.error("Error creating sale:", err.message);
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
      res.status(200).json(sales || []);
    } catch (err) {
      console.error("Error fetching sales:", err.message);
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Sale ID is required" });
      }

      const sale = await salesService.getSaleById(req.user.tenantId, id);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }

      res.status(200).json(sale);
    } catch (err) {
      console.error("Error fetching sale:", err.message);
      next(err);
    }
  },
};
