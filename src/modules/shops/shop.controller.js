import { shopService } from "./shop.service.js";

export const shopController ={
    create: async (req, res, next) => {
        try {
            const shop = await shopService.createShop(req.user.tenantId, req.body);
            res.status(201).json(shop);
        } catch (err) {
            next(err);
        }
    },

    list: async (req, res, next) => {
        try {
            const shops = await shopService.getShops(req.user.tenantId);
            res.json(shops);
        } catch (err) {
            next(err);
        }
    },

    getOne: async (req, res, next) => {
        try {
            const shop = await shopService.getShopById(req.user.tenantId, req.params.id);
            res.json(shop);
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const updated = await shopService.updateShop(req.user.tenantId, req.params.id, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    },

    remove: async (req, res, next) => {
        try {
            const result = await shopService.deleteShop(req.user.tenantId, req.params.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },
};