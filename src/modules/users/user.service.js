import bcrypt from "bcryptjs";
import {prisma} from "../../config/db.js";

export const userService = {
    createUser: async (tenantId, data) => {
        const existing = await prisma.user.findUnique({where: {email: data.email}});
        if (existing) throw new Error("User with this email already exist");

        const hashed = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data:{
                tenantId,
                name: data.name,
                email: data.email,
                password: hashed,
                role: data.role || "staff",
            },
        });

        return user;
    },

    getAllUsers: async (tenantId) => {
        return await prisma.user.findMany({
            where: {tenantId},
            select: {id: true, name: true, email: true, role: true, createdAt: true},
            orderBy: {createdAt: "desc"},
        });
    },

    getUserById: async (tenantId, id) => {
        const user = await prisma.user.findUnique({where: {id, tenantId}});
        if (!user) throw new Error("User not found");

        return user;
    },

    updateUser: async (tenantId, id, data) => {
        const user = await prisma.user.findFirst({where: {id, tenantId}});
        if (!user) throw new Error("User not found");

        let updateData = {name: data.name, role: data.role};
        if (data.password){
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        return await prisma.user.update({where: {id}, data: updateData,});
    },

    deleteUser: async (tenantId, id) => {
        const user = await prisma.user.findFirst({where: {id, tenantId}},);
        if (!user) throw new Error("User not found");

        await prisma.user.delete({where: {id}});
        return {message: "User deleted successfully"};
    },
};