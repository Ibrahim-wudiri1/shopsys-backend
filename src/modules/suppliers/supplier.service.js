import { prisma } from "../../config/db.js";

export const supplierService = {
  createSupplier: async (tenantId, data) => {
    const supplier = await prisma.supplier.create({
      data: {
        tenantId,
        name: data.name,
        company: data.company || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      },
    });
    return supplier;
  },

  listSuppliers: async (tenantId) => {
    return await prisma.supplier.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  },

  getSupplierById: async (tenantId, id) => {
    const supplier = await prisma.supplier.findFirst({
      where: { id, tenantId },
    });
    if (!supplier) throw new Error("Supplier not found");
    return supplier;
  },

  updateSupplier: async (tenantId, id, data) => {
    const supplier = await prisma.supplier.findFirst({
      where: { id, tenantId },
    });
    if (!supplier) throw new Error("Supplier not found");

    return await prisma.supplier.update({
      where: { id },
      data,
    });
  },

  deleteSupplier: async (tenantId, id) => {
    const supplier = await prisma.supplier.findFirst({
      where: { id, tenantId },
    });
    if (!supplier) throw new Error("Supplier not found");

    await prisma.supplier.delete({ where: { id } });
    return { message: "Supplier deleted successfully" };
  },
};
