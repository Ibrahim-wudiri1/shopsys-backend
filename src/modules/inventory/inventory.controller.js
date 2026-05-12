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
    },

    /**
     * Sync inventory - returns current inventory state for offline cache
     */
    syncInventory: async (req, res, next) => {
        try {
            const { shopId } = req.query;

            if (!shopId) {
                return res.status(400).json({ message: "Shop ID is required" });
            }

            // Get current inventory for the shop
            const inventory = await inventoryService.getInventory(req.user.tenantId, shopId);

            // Add sync metadata
            const response = inventory.map(item => ({
                ...item,
                lastSyncedAt: new Date().toISOString(),
            }));

            res.status(200).json(response);
        } catch (err) {
            console.error("Error syncing inventory:", err.message);
            next(err);
        }
    },
}