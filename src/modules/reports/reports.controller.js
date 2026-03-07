import { reportsService } from "./reports.service.js";

export const reportsController = {
  salesSummary: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const result = await reportsService.getSalesSummary(
        req.user.tenantId,
        startDate,
        endDate
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  topProducts: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit || 10);
      const result = await reportsService.getTopSellingProducts(req.user.tenantId, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  lowStock: async (req, res, next) => {
    try {
      const threshold = parseInt(req.query.threshold || 5);
      const result = await reportsService.getLowStockProducts(req.user.tenantId, threshold);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  supplierActivity: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const result = await reportsService.getSupplierActivity(
        req.user.tenantId,
        startDate,
        endDate
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  salesLast7Days: async (req, res, next) => {
    try {

      const data = await reportsService.getSalesLast7Days(
        req.user.tenantId
      );

      res.json(data);

    } catch (err) {
      next(err);
    }
  },

  overview: async (req, res, next) => {
    try {
      const data = await reportsService.getOverview(req.user.tenantId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};

