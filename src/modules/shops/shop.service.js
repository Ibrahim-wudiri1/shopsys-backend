import {prisma} from "../../config/db.js";

export const shopService = {
    createShop: async (tenantId, data) => {

        const existShop = await prisma.shop.findFirst({
            where: {name: data.name, location: data.location},
        });

        if(existShop){
            throw new Error(`Shop with this name "${data.name}", and location "${data.location}" already exist`);
        }
        const shop = await prisma.shop.create({
            data: {
                tenantId,
                name: data.name,
                location: data.location || "",
            },
        });
        return shop;
    },

    getShops: async (tenantId) => {
        return await prisma.shop.findMany({
            where: {tenantId},});
        // return shops;
    },

    getShopById: async (tenantId, id) => {
        const shop = await prisma.shop.findUnique({where: {id, tenantId}});
        if(!shop) throw new Error("Shop not found");

        return shop;
    },

    updateShop: async (tenantId, id, data) => {
        const shop = await prisma.shop.findFirst({
            where: {id, tenantId},
        });
        if(!shop) throw new Error("Shop not found");

        return await prisma.shop.update({
            where: {id},
            data: {
                name: data.name,
                location: data.location,
            },
        });
    },

    deleteShop: async (tenantId, id) => {
        const shop = await prisma.shop.findFirst({
            where: {id, tenantId},
        });
        if(!shop) throw new Error("Shop not found");

        await prisma.shop.delete({
            where: {id}
        });

        return {message: "Shop deleted successfully"};
    },
};
