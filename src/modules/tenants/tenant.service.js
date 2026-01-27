import { prisma } from "../../config/db.js";

export const tenantService = {
    creatTenant: async (id, data) => {

        const existTenant = await prisma.tenant.findFirst({
            where: {name: data.name},
        });

        if(existTenant) 
            throw new  Error("Tenant with this name already exist. add number or anything to diffrentiate");

        const tenant = await prisma.tenant.create({
            data:{
                "name": data.name,
                "logo": data.logo
            }
        });

        return tenant;
    },
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