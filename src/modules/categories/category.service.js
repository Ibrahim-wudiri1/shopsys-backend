import { prisma } from "../../config/db.js";

function buildCategoryWhere(shopId, tenantId, extra = {}) {
  const where = { ...extra };
  if (shopId) where.shopId = shopId;
  if (tenantId) where.tenantId = tenantId;
  return where;
}

async function tryCreateCategory(data, shopId, tenantId) {
  const baseData = {
    name: data.name,
    tenantId,
  };

  if (shopId) {
    baseData.shopId = shopId;
  }

  try {
    return await prisma.category.create({ data: baseData });
  } catch (error) {
    if (error.message.includes("Unknown argument `shopId`") || error.message.includes("Unknown field 'shopId'")) {
      delete baseData.shopId;
      return await prisma.category.create({ data: baseData });
    }
    throw error;
  }
}

function buildFilter(shopId, tenantId) {
  if (!shopId) {
    return { tenantId };
  }

  try {
    return { shopId, tenantId };
  } catch (error) {
    return { tenantId };
  }
}

export const categoryService = {
  createCategory: async (shopId, tenantId, data) => {
    const where = shopId
      ? { shopId, name: data.name }
      : { tenantId, name: data.name };

    try {
      const existing = await prisma.category.findFirst({ where });
      if (existing) throw new Error("Category already exists");
    } catch (error) {
      if (!error.message.includes("Unknown argument `shopId`") && !error.message.includes("Unknown field 'shopId'")) {
        throw error;
      }
    }

    return await tryCreateCategory(data, shopId, tenantId);
  },

  listCategory: async (shopId, tenantId) => {
    try {
      return await prisma.category.findMany({
        where: { shopId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      if (error.message.includes("Unknown argument `shopId`") || error.message.includes("Unknown field 'shopId'")) {
        return await prisma.category.findMany({
          where: { tenantId },
          orderBy: { createdAt: "desc" },
        });
      }
      throw error;
    }
  },

  getCategoryById: async (shopId, id, tenantId) => {
    const where = shopId ? { shopId, id } : { id, tenantId };
    const category = await prisma.category.findFirst({
      where,
      include: { shop: true, products: true },
    });
    if (!category) throw new Error("Category not found");
    return category;
  },

  updateCategory: async (shopId, id, data, tenantId) => {
    const where = shopId ? { shopId, id } : { id, tenantId };
    const category = await prisma.category.findFirst({ where });
    if (!category) throw new Error("Category not found");

    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  deleteCategory: async (shopId, id, tenantId) => {
    const where = shopId ? { shopId, id } : { id, tenantId };
    const category = await prisma.category.findFirst({ where });
    if (!category) throw new Error("Category not found");

    await prisma.category.delete({ where: { id } });
    return { message: "Category deleted successfully" };
  },

  // Add points (for loyalty system)
//   addLoyaltyPoints: async (tenantId, customerId, points) => {
//     const customer = await prisma.customer.findFirst({
//       where: { tenantId, id: customerId },
//     });
//     if (!customer) throw new Error("Customer not found");

//     return await prisma.customer.update({
//       where: { id: customerId },
//       data: { loyaltyPoints: { increment: points } },
//     });
//   },
};
