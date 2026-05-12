import { salesService } from "./sales.service.js";
import { mergeOfflineSales, validateOfflineSaleData, getInventorySnapshot } from "../../utils/syncMerge.js";

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

  /**
   * Sync offline sales (batch create from client)
   */
  syncOffline: async (req, res, next) => {
    try {
      const { sales } = req.body;

      // Validate request
      if (!Array.isArray(sales) || sales.length === 0) {
        return res.status(400).json({ message: "Sales array is required" });
      }

      if (sales.length > 100) {
        return res.status(400).json({ message: "Maximum 100 sales per sync" });
      }

      const tenantId = req.user.tenantId;
      const userId = req.user.id;

      // Validate and enrich sales data
      const enrichedSales = sales.map(sale => ({
        ...sale,
        tenantId,
        userId,
      }));

      // Use sync merge logic
      const result = await mergeOfflineSales(tenantId, enrichedSales);

      // Add current inventory snapshot for conflict resolution
      if (result.conflicts.length > 0 && enrichedSales.length > 0) {
        const shopId = enrichedSales[0].shopId;
        const inventorySnapshot = await getInventorySnapshot(tenantId, shopId);
        result.conflicts.forEach(conflict => {
          conflict.currentInventory = inventorySnapshot;
        });
      }

      // Return detailed response (207 Multi-Status)
      res.status(207).json(result);
    } catch (err) {
      console.error("Error syncing offline sales:", err.message);
      next(err);
    }
  },
};
