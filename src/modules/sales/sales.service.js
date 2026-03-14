import { prisma } from "../../config/db.js";

export const salesService = {
  createSale: async (tenantId, shopId, userId, items, paymentType) => {
    if (!items || items.length === 0) {
      throw new Error("No items in sale");
    }
    console.log(items);
    

    return prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, tenantId, shopId },
          include: { inventory: true },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (!product.inventory) {
          throw new Error(`Inventory not found for product ${product.name}`);
        }

        if (product.inventory.currentQty < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const lineTotal = item.quantity * product.sellingPrice;
        totalAmount += lineTotal;

        await tx.inventory.update({
          where: { id: product.inventory.id },
          data: { currentQty: { decrement: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            tenantId,
            productId: product.id,
            userId,
            quantity: item.quantity,
            type: "OUT",
            note: "Sale transaction",
          },
        });
      }

      const sale = await tx.sale.create({
        data: {
          tenantId,
          shopId,
          cashierId: userId,
          totalAmount,
          paymentType,
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.sellingPrice,
          },
        });
      }

      return { saleId: sale.id, totalAmount };
    });
  },

  getSales: async (tenantId, shopId, filters = {}) => {
    const where = { tenantId };

    if (shopId) where.shopId = shopId;

    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    return prisma.sale.findMany({
      where,
      include: {
        // user: { select: { name: true } },
        shop: { select: { name: true } },
        items: {
          include: {
            product: { select: { name: true, sku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getSaleById: async (tenantId, id) => {
    const sale = await prisma.sale.findFirst({
      where: { id, tenantId },
      include: {
        items: { include: { product: true } },
        // user: { select: { name: true } },
        shop: { select: { name: true } },
        tenant: true,
        cashier: true
      },
    });

    if (!sale) throw new Error("Sale not found");
    return sale;
  },
};
