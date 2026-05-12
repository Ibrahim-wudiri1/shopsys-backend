import { userService } from "./user.service.js";

export const userController ={
    create: async (req, res, next) => {
        try {
            const user = await userService.createUser(req.user.tenantId, req.body, req.user.role);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    },

    list: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers(req.user.tenantId);
            res.json(users);
        } catch (err) {
            next(err);
        }
    },

    getOne: async (req, res, next) => {
        try {
            const user = await userService.getUserById(req.user.tenantId, req.params.id);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },

    update: async (req, res, next) => {
        try {
            const updated = await userService.updateUser(req.user.tenantId, req.params.id, req.body, req.user.role);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    },

    remove: async (req, res, next) => {
        try {
            const result = await userService.deleteUser(req.user.tenantId, req.params.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    changePassword: async (req, res, next) => {
        try {
            if (req.params.id !== req.user.id && req.user.role !== 'TENANT_ADMIN') {
                return res.status(403).json({ message: 'Not authorized to change this user\'s password' });
            }
            const { newPassword } = req.body;
            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }
            await userService.changePassword(req.params.id, newPassword);
            res.json({ message: 'Password changed successfully' });
        } catch (err) {
            next(err);
        }
    },
};

