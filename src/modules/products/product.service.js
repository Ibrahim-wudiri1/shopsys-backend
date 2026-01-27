import {prisma} from "../../config/db.js";

export const productService ={
    createProduct: async (tenantId, data) => {
        const shop = await prisma.shop.findFirst({
            where: { id: data.shopId, tenantId},
        });

        if (!shop) throw new Error("Shop not found or not authorized");

        const existing = await prisma.product.findFirst({
            where: {sku: data.sku, tenantId},
        });

        if(existing) throw new Error("SKU already exist for this tenant");

        const product = await prisma.product.create({
            data: {
                tenantId,
                shopId: data.shopId,
                name: data.name,
                sku: data.sku,
                category: data.category,
                costPrice: data.costPrice,
                sellingPrice: data.sellingPrice,
                minimumStock: data.minimumStock || 0,
            },
        });

        //initialize inventory record
        await prisma.inventory.create({
            data: {
                tenantId,
                productId: product.id,
                currentQty: 0,
            },
        });

        return product;
    },

    getProduct: async (tenantId, shopId) => {
        return await prisma.product.findMany({
            where: {tenantId, shopId},
            include: {
                inventory: true,
            },
            orderBy: {createdAt: "desc"},
        });
    },

    getProductById: async (tenantId, id) => {
        const product = await prisma.product.findFirst({
            where: {id: id, tenantId},
            include: {inventory: true},
        });

        if (!product) throw new Error("Product not found");

        return product;
    },

    updateProduct: async (tenantId, id ,data) => {
        const product = await prisma.product.findFirst({
            where: { id, tenantId},
        });

        if(!product) throw new Error("Product not found");

        return await prisma.product.update({
            where: {id},
            data: {
                name: data.name,
                sku: data.sku,
                category: data.category,
                costPrice: data.costPrice,
                sellingPrice: data.sellingPrice,
                minimumStock: data.minimumStock,
            },
        });
    },

    deleteProduct: async (tenantId, id) => {
        const product = await prisma.product.findFirst({
            where: {id, tenantId},
        });
        if(!product) throw new Error("Product not found");

        await prisma.product.delete({where: {id}});
        return {message: "Product deleted successfully"};
    },
};