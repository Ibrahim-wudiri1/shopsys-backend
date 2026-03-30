import { prisma } from "../../config/db.js";

export const categoryService = {
  createCategory: async (tenantId, data) => {
    const existing = await prisma.category.findFirst({
      where: { tenantId, name: data.name },
    });
    if (existing) throw new Error("Category already exists");

    return await prisma.category.create({
      data: {
        tenantId,
        name: data.name,
      },
    });
  },

  listCategory: async (tenantId) => {
    return await prisma.category.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  },

  getCategoryById: async (tenantId, id) => {
    const category = await prisma.category.findFirst({
      where: { tenantId, id },
      include: { tenant: true },
      include: { products: true },
    });
    if (!category) throw new Error("Category not found");
    return category;
  },

  updateCategory: async (tenantId, id, data) => {
    const category = await prisma.category.findFirst({
      where: { tenantId, id },
    });
    if (!category) throw new Error("Category not found");

    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  deleteCategory: async (tenantId, id) => {
    const category = await prisma.category.findFirst({
      where: { tenantId, id },
    });
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
