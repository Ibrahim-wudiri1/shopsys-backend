import {prisma} from "../../config/db.js";

export const inventoryService = {
    getInventory: async (tenantId, shopId) => {
        return await prisma.inventory.findMany({
            where: {tenantId, product: {shopId}},
            include: {product: true},
            orderBy: {updatedAt: "desc"},
        });
    },

    stockIn: async (tenantId, productId, quantity, userId, note = "") => {
        const inventory = await prisma.inventory.findFirst({
            where: {tenantId, productId},
        });
        if(!inventory) throw new Error("Inventory record not found");

        const updated = await prisma.inventory.update({
            where: {id: inventory.id},
            data: {
                currentQty: inventory.currentQty + quantity,
            },
        });

        //log stock movement
        //question? do i have this table in db
        await prisma.stockMovement.create({
            data:{
                tenantId,
                productId,
                userId,
                type: "IN",
                quantity,
                note,
            },
        });

        return updated;
    },

    stockOut: async (tenantId, productId, quantity, userId, note ="") => {
        const inventory = await prisma.inventory.findFirst({
            where: {tenantId, productId},
        });
        if (!inventory) throw new Error("Inventory record not found");

        if(inventory.currentQty < quantity)
            throw new Error("Insufficient stock available");

        const updated = await prisma.inventory.update({
            where: {id: inventory.id},
            data: {
                currentQty: inventory.currentQty - quantity,
            },
        });

        await prisma.stockMovement.create({
            data: {
                tenantId,
                productId,
                userId,
                type: "OUT",
                quantity,
                note,
            },
        });

        return updated;
    },

    getMovements: async (tenantId, productId) => {
        return await prisma.stockMovement.findMany({
            where: {tenantId, productId},
            include: {product: true, user: {select: {name: true, email: true}}},
            orderBy: {createdAt: "desc"},
        });
    },
}