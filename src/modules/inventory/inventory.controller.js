import { inventoryService } from "./inventory.service.js";

export const inventoryController = {
    list: async (req, res, next) => {
        try {
            const shopId = req.query.shopId;
            const result = await inventoryService.getInventory(req.user.tenantId, shopId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    stockIn: async (req, res, next) => {
        try {
            const {productId, quantity, note} = req.body;
            const result = await inventoryService.stockIn(
                req.user.tenantId,
                productId,
                Number(quantity),
                req.user.id,
                note
            );
            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    stockOut: async (req, res, next) => {
        try {
            const {productId, quantity, note} = req.body;
            const result = await inventoryService.stockOut(
                req.user.tenantId, 
                productId, 
                quantity, 
                req.user.id, 
                note
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    movementHistory: async (req, res, next) => {
        try {
            const {productId} = req.body;
            const movements = await inventoryService.getMovements(req.user.tenantId, productId);
            res.json(movements);
        } catch (err) {
            next(err);
        }
    }
}