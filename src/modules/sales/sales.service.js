import { prisma } from "../../config/db.js";

export const salesService = {
  createSale: async (tenantId, shopId, userId, items, paymentMethod) => {
    if (!items || items.length === 0) {
      throw new Error("No items in sale");
    }

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

        if (product.inventory.qty < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const lineTotal = item.quantity * product.sellingPrice;
        totalAmount += lineTotal;

        await tx.inventory.update({
          where: { id: product.inventory.id },
          data: { qty: { decrement: item.quantity } },
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
          userId,
          totalAmount,
          paymentMethod,
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        await tx.saleItem.create({
          data: {
            tenantId,
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
        user: { select: { name: true } },
        shop: { select: { name: true } },
        saleItems: {
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
        saleItems: { include: { product: true } },
        user: { select: { name: true } },
        shop: { select: { name: true } },
      },
    });

    if (!sale) throw new Error("Sale not found");
    return sale;
  },
};
