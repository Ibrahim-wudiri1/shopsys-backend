import { tenantService } from "./tenant.service.js";

export const tenantController ={
    create: async (req, res, next) => {
        try {
            const result = await tenantService.creatTenant(req.user.id, req.body);
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
        
    },
    getTenant: async (req, res, next) => {
        try {
            const result = await tenantService.getTenantById(req.user.tenantId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    updateTenant: async (req, res, next) => {
        try {
            const data = req.body;
            const result = await tenantService.updateTenant(req.user.tenantId, data);

            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    deleteTenant: async (req, res, next) => {
        const tenantId = req.params;
        try {
            const result = await tenantService.deleteTenant(tenantId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    listTenants: async (req, res, next) => {
        try {
            const tenants = await tenantService.listTenants();
            res.json(tenants);
        } catch (err) {
            next(err);
        }
    }
};