import { tenantService } from "./tenant.service.js";

export const tenantController ={
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
        try {
            const result = await tenantService.deleteTenant(req.user.tenantId);
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