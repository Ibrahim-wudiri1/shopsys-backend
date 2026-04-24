import { productService } from "./product.service.js";

export const productController = {
    create: async (req, res, next) => {
        try {
            console.log("Creating product with data:", req.body);
            const product = await productService.createProduct(req.user.tenantId, req.body);
            res.status(201).json(product);
        } catch (err) {
            next(err);
        }

    },

    list: async (req, res, next) => {
        try {
            const shopId = req.query.shopId;
            const products = await productService.getProduct(req.user.tenantId, shopId);

            res.json(products);
        } catch (err) {
            next(err);
        }
    },

    getOne: async (req, res, next) => {
        try {
            const product = await productService.getProductById(req.user.tenantId, req.params.id);
            res.json(product);
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const updated = await productService.updateProduct(req.user.tenantId, req.params.id, req.body);
            res.json(updated); 
        } catch (err) {
            next(err);
        }
    },

    delete: async (req, res,next) => {
        try {
            const result = await productService.deleteProduct(req.user.tenantId, req.params.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },
};