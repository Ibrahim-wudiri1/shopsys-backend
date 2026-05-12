/**
 * Sync Merge Utility
 * Server-side merge logic for handling offline sales synchronization
 * with conflict detection and resolution
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Merge offline sales with server state
 * Validates inventory and handles conflicts
 */
export async function mergeOfflineSales(tenantId, offlineSales) {
  const results = {
    successful: [],
    failed: [],
    conflicts: [],
  };

  for (const sale of offlineSales) {
    try {
      // Validate required fields
      if (!sale.shopId || !sale.items || !Array.isArray(sale.items) || sale.items.length === 0) {
        results.failed.push({
          offlineId: sale.offlineId,
          message: "Invalid sale data - missing shopId or items",
        });
        continue;
      }

      // Check if sale already synced (idempotency)
      const existingSale = await prisma.sale.findFirst({
        where: {
          tenantId,
          shopId: sale.shopId,
          // Look for sale with matching offline ID or timestamp window
          createdAt: {
            gte: new Date(new Date(sale.createdAt).getTime() - 60000), // Within 1 minute
            lte: new Date(new Date(sale.createdAt).getTime() + 60000),
          },
        },
      });

      if (existingSale) {
        results.successful.push({
          id: existingSale.id,
          offlineId: sale.offlineId,
          totalAmount: existingSale.totalAmount,
          syncedAt: existingSale.createdAt,
          message: "Already synced",
        });
        continue;
      }

      // Get current inventory for the shop
      const inventory = await prisma.inventory.findMany({
        where: {
          tenantId,
          shopId: sale.shopId,
        },
      });

      const inventoryMap = {};
      inventory.forEach(item => {
        inventoryMap[item.productId] = item.currentQty;
      });

      // Check if inventory is sufficient for all items
      let inventoryConflict = null;
      for (const saleItem of sale.items) {
        const available = inventoryMap[saleItem.productId] || 0;
        if (available < saleItem.quantity) {
          inventoryConflict = {
            type: "INSUFFICIENT_INVENTORY",
            productId: saleItem.productId,
            availableQuantity: available,
            requestedQuantity: saleItem.quantity,
            shortfall: saleItem.quantity - available,
          };
          break;
        }
      }

      if (inventoryConflict) {
        results.conflicts.push({
          offlineId: sale.offlineId,
          conflict: inventoryConflict,
          message: "Inventory conflict detected",
        });
        continue;
      }

      // All validations passed - proceed to create sale
      const syncResult = await createSaleWithInventoryUpdate(
        tenantId,
        sale,
        inventoryMap
      );

      results.successful.push({
        id: syncResult.saleId,
        offlineId: sale.offlineId,
        totalAmount: syncResult.totalAmount,
        syncedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error merging sale:", error);
      results.failed.push({
        offlineId: sale.offlineId,
        message: error.message || "Unknown error during sync",
      });
    }
  }

  return results;
}

/**
 * Create sale and update inventory atomically
 */
async function createSaleWithInventoryUpdate(tenantId, saleData, inventoryMap) {
  return await prisma.$transaction(async (tx) => {
    // Calculate total amount
    let totalAmount = 0;
    const saleItems = [];

    for (const item of saleData.items) {
      const lineTotal = item.quantity * item.price;
      totalAmount += lineTotal;
      saleItems.push({
        quantity: item.quantity,
        price: item.price,
        lineTotal,
        productId: item.productId,
      });
    }

    // Create sale
    const sale = await tx.sale.create({
      data: {
        tenantId,
        shopId: saleData.shopId,
        totalAmount,
        paymentType: saleData.paymentType,
        customerId: saleData.customerId || null,
        userId: saleData.userId,
        items: {
          create: saleItems,
        },
        metadata: {
          offlineId: saleData.offlineId,
          syncedOffline: true,
          originalTimestamp: saleData.createdAt,
        },
      },
    });

    // Update inventory - decrease by quantities sold
    for (const item of saleData.items) {
      await tx.inventory.update({
        where: {
          productId_shopId: {
            productId: item.productId,
            shopId: saleData.shopId,
          },
        },
        data: {
          currentQty: {
            decrement: item.quantity,
          },
        },
      });

      // Create stock movement record (audit trail)
      await tx.stockMovement.create({
        data: {
          tenantId,
          productId: item.productId,
          shopId: saleData.shopId,
          saleId: sale.id,
          type: "OUT",
          quantity: item.quantity,
          userId: saleData.userId,
          notes: `Offline sale synced: ${saleData.offlineId}`,
        },
      });
    }

    return {
      saleId: sale.id,
      totalAmount,
      itemCount: saleItems.length,
    };
  });
}

/**
 * Validate offline sale data before processing
 */
export function validateOfflineSaleData(sale) {
  const errors = [];

  if (!sale.offlineId) {
    errors.push("offlineId is required");
  }

  if (!sale.shopId) {
    errors.push("shopId is required");
  }

  if (!sale.tenantId) {
    errors.push("tenantId is required");
  }

  if (!sale.userId) {
    errors.push("userId is required");
  }

  if (!sale.paymentType) {
    errors.push("paymentType is required");
  }

  if (!Array.isArray(sale.items) || sale.items.length === 0) {
    errors.push("items array is required and must not be empty");
  } else {
    for (let i = 0; i < sale.items.length; i++) {
      const item = sale.items[i];
      if (!item.productId) {
        errors.push(`items[${i}].productId is required`);
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        errors.push(`items[${i}].quantity must be a positive number`);
      }
      if (typeof item.price !== "number" || item.price < 0) {
        errors.push(`items[${i}].price must be a non-negative number`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get current inventory snapshot for client
 */
export async function getInventorySnapshot(tenantId, shopId) {
  try {
    const inventory = await prisma.inventory.findMany({
      where: {
        tenantId,
        shopId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });

    return inventory.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productSku: item.product.sku,
      currentQty: item.currentQty,
      lastUpdated: item.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching inventory snapshot:", error);
    throw error;
  }
}
