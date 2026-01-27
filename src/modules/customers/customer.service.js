import { prisma } from "../../config/db.js";

export const customerService = {
  createCustomer: async (tenantId, data) => {
    const existing = await prisma.customer.findFirst({
      where: { tenantId, email: data.email },
    });
    if (existing) throw new Error("Customer already exists");

    return await prisma.customer.create({
      data: {
        tenantId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        loyaltyPoints: 0,
      },
    });
  },

  listCustomers: async (tenantId) => {
    return await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  },

  getCustomerById: async (tenantId, id) => {
    const customer = await prisma.customer.findFirst({
      where: { tenantId, id },
      include: {
        sales: {
          include: {
            saleItems: { include: { product: true } },
          },
        },
      },
    });
    if (!customer) throw new Error("Customer not found");
    return customer;
  },

  updateCustomer: async (tenantId, id, data) => {
    const customer = await prisma.customer.findFirst({
      where: { tenantId, id },
    });
    if (!customer) throw new Error("Customer not found");

    return await prisma.customer.update({
      where: { id },
      data,
    });
  },

  deleteCustomer: async (tenantId, id) => {
    const customer = await prisma.customer.findFirst({
      where: { tenantId, id },
    });
    if (!customer) throw new Error("Customer not found");

    await prisma.customer.delete({ where: { id } });
    return { message: "Customer deleted successfully" };
  },

  // Add points (for loyalty system)
  addLoyaltyPoints: async (tenantId, customerId, points) => {
    const customer = await prisma.customer.findFirst({
      where: { tenantId, id: customerId },
    });
    if (!customer) throw new Error("Customer not found");

    return await prisma.customer.update({
      where: { id: customerId },
      data: { loyaltyPoints: { increment: points } },
    });
  },
};
