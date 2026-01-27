import { prisma } from "../../config/db.js";

export const tenantService = {
    getTenantById: async (tenantId) => {
        const tenant = await prisma.tenant.findUnique({
            where: {id: tenantId},
        });
        if (!tenant) throw new Error("Tenant not found");

        return tenant;
    },

    updateTenant: async (tenantId, data) => {
        const tenant = await prisma.tenant.update({
            where: {id: tenantId},
            data,
        });
        return tenant;
    },

    deleteTenant: async (tenantId) => {
        await prisma.tenant.delete({
            where: {id: tenantId},
        });
        return {message: "Tenant deleted successfully"};
    },

    listTenants: async () => {
        return await prisma.tenant.findMany({
            orderBy: {createdAt: "desc"}
        });
    }
};