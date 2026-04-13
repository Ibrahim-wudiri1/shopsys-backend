import { prisma } from "../../config/db.js";

export const reportsService = {
  getSalesSummary: async (tenantId, startDate, endDate) => {
    const where = { tenantId };
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: true,
      },
    });

    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalTransactions = sales.length;
    const totalItemsSold = sales.reduce(
      (sum, s) => sum + s.items.reduce((a, i) => a + i.quantity, 0),
      0
    );

    return {
      totalSales,
      totalTransactions,
      totalItemsSold,
      avgSaleValue: totalTransactions > 0 ? totalSales / totalTransactions : 0,
    };
  },

  getTopSellingProducts: async (tenantId, limit = 10) => {
    const items = await prisma.saleItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: { sale: { tenantId } },
      orderBy: { _sum: { quantity: "desc" } },
      take: limit,
    });

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true },
    });

    return items.map((i) => ({
      product: products.find((p) => p.id === i.productId),
      quantitySold: i._sum.quantity,
    }));
  },

  getLowStockProducts: async (tenantId, threshold = 5) => {
    const inventory = await prisma.inventory.findMany({
      where: {
        tenantId,
        currentQty: { lte: threshold },
      },
      include: { product: true },
      orderBy: { currentQty: "asc" },
    });

    return inventory.map((i) => ({
      productName: i.product.name,
      sku: i.product.sku,
      currentQty: i.currentQty,
    }));
  },

  getSupplierActivity: async (tenantId, startDate, endDate) => {
    const where = { tenantId };
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const orders = await prisma.purchaseOrder.findMany({
      where,
      include: { supplier: true },
    });

    const totalOrders = orders.length;
    const received = orders.filter((o) => o.status === "Received").length;

    const supplierCounts = {};
    for (const order of orders) {
      const supplierName = order.supplier?.name || "Unknown";
      supplierCounts[supplierName] = (supplierCounts[supplierName] || 0) + 1;
    }

    return {
      totalOrders,
      receivedOrders: received,
      supplierBreakdown: supplierCounts,
    };
  },

  getSalesLast7Days: async (tenantId) => {

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const sales = await prisma.sale.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    const result = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const key = d.toISOString().slice(0, 10);
      result[key] = 0;
    }

    sales.forEach((sale) => {
      const key = sale.createdAt.toISOString().slice(0, 10);
      if (result[key] !== undefined) {
        result[key] += sale.totalAmount;
      }
    });

    return Object.entries(result)
      .map(([date, total]) => ({
        date,
        total,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  },
  
  getOverview: async (tenantId) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

    const [
      salesToday,
      salesMonth,
      totalCustomers,
      lowStockProducts,
      recentSales,
    ] = await Promise.all([
      prisma.sale.aggregate({
        where: { tenantId, createdAt: { gte: todayStart } },
        _sum: { totalAmount: true },
      }),
      prisma.sale.aggregate({
        where: { tenantId, createdAt: { gte: monthStart } },
        _sum: { totalAmount: true },
      }),
      prisma.customer.count({ where: { tenantId } }),
      prisma.product.findMany({
        where: {
          tenantId,
          quantity: { lte: 5 },
        },
        select: { id: true, name: true, quantity: true },
        take: 5,
      }),
      prisma.sale.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      salesToday: salesToday._sum.totalAmount || 0,
      salesThisMonth: salesMonth._sum.totalAmount || 0,
      totalCustomers,
      lowStockCount: lowStockProducts.length,
      recentSales,
      lowStockProducts,
    };
  },

};
