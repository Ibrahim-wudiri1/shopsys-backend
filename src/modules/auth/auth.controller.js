import {authService} from "./auth.service.js";

export const authController = {
    register: async (req, res, next) =>{
        try {
            const {tenantName, logo, admin} = req.body;

            const result = await authService.register({
                tenantName,
                logo,
                admin,
            });

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) =>{
        try {
            const {email, password} = req.body;

            const result = await authService.login({email, password});

            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    me: async (req, res, next) => {
        try {
            res.json(req.user);
        } catch (err) {
            next(err)
        }
    },
}