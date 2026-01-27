import {prisma} from "../../config/db.js";

export const salesService = {
    createSales: async (tenantId, shopId, userId, items, paymentMethod) => {
        if (!items || !items.length) 
            throw new Error("No items in sale");

        // start transaction
        return prisma.$transaction(async (tx) => {
            let totalAmount = 0;

            for(const item of items){
                const product = await tx.product.findFirst({
                    where: {id: item.productId, tenantId, shopId},
                    include: {inventory: true},
                });

                if(!product)
                    throw new Error(`Product ${item.productId} not found`);
                if(product.inventory.currentQty < item.quantity)
                    throw new Error(`Insufficient stock for product ${product.name}`);

                //calculate total
                totalAmount = item.quantity * product.sellingPrice;

                //deduct stock
                await tx.inventory.update({
                    where: {id: product.inventory.id},
                    data:{currentQty: {decrement: item.quantity}},
                });

                //record stock movement
                await tx.stockMovement.create({
                    data: {
                        tenantId,
                        productId: product.id,
                        userId,
                        quantity: item.quantity,
                        type: "OUT",
                        note: "Sale transaction",
                    },
                });

            }

            //create sale record
            const sale = await tx.sale.create({
                data:{
                    tenantId,
                    shopId,
                    userId,
                    totalAmount,
                    paymentMethod,
                },
            });

            //create sale items
            for(const item of items){
                await tx.saleitem.create({
                    data:{
                        saleId: sale.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price || undefined,
                    },
                });
            }
            return {sale, totalAmount};
        });
    },

    getSales: async (tenantId, shopId, filters = {}) => {
        const where = {tenantId};
        if(shopId) where.shopId = shopId;
        if(filters.startDate && filters.endDate){
            where.createdAt = {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate),
            };
        }

        return await prisma.sale.findMany({
            where,
            include: {
                user: {select: {name: true}},
                shop: {select: {name: true}},
                saleItems: {
                    include: {product: {select: {name: true, sku: true}}},
                },
            },
            orderBy: { createdAt: "desc"},
        });
    },

    getSaleById: async (tenantId, id) => {
        const sale = await prisma.sale.findFirst({
            where: {id, tenantId},
            include:{
                saleItems: {include: {product: true}},
                user: {select: {name: true}},
                shop: {select: {name: true},}
            },
        });
        if (!sale) throw new Error("Sale not found");
        return sale;
    },
    
}