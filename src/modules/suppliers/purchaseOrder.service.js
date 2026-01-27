import { prisma } from "../../config/db.js";

export const purchaseOrderService = {
  createPurchaseOrder: async (tenantId, supplierId, shopId, items, userId) => {
    if (!items || !items.length) throw new Error("Order must contain items");

    return await prisma.$transaction(async (tx) => {
      const order = await tx.purchaseOrder.create({
        data: {
          tenantId,
          supplierId,
          shopId,
          userId,
          status: "Pending",
        },
      });

      for (const item of items) {
        await tx.purchaseOrderItem.create({
          data: {
            tenantId,
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            costPrice: item.costPrice,
          },
        });
      }

      return order;
    });
  },

  receiveOrder: async (tenantId, orderId, userId) => {
    const order = await prisma.purchaseOrder.findFirst({
      where: { id: orderId, tenantId },
      include: { items: true },
    });

    if (!order) throw new Error("Purchase order not found");
    if (order.status === "Received") throw new Error("Order already received");

    return await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const inventory = await tx.inventory.findFirst({
          where: { tenantId, productId: item.productId },
        });
        if (!inventory) continue;

        await tx.inventory.update({
          where: { id: inventory.id },
          data: { currentQty: { increment: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            tenantId,
            productId: item.productId,
            userId,
            type: "IN",
            quantity: item.quantity,
            note: `Purchase order #${orderId}`,
          },
        });
      }

      const updatedOrder = await tx.purchaseOrder.update({
        where: { id: order.id },
        data: { status: "Received" },
      });

      return updatedOrder;
    });
  },

  listPurchaseOrders: async (tenantId, supplierId = null) => {
    const where = { tenantId };
    if (supplierId) where.supplierId = supplierId;

    return await prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
