import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.js";
import {signToken} from "../../utils/jwt.js";

export const authService = {
    register: async ({tenantName, logo, admin}) => {
        // create tenant
        const tenant = await prisma.tenant.create({
            data:{
                name: tenantName,
                logo: logo || null,
            },
        });

        // hash password
        const hashedPassword = await bcrypt.hash(admin.password, 10);

        // check if user exist
        const existUser = await prisma.user.findUnique({
            where: {email: admin.email},
        });

        if(existUser) throw new Error("User with this email already exist");
        //create admin user
        const user = await prisma.user.create({
            data:{
                tenantId: tenant.id,
                name: admin.name,
                email: admin.email,
                password: hashedPassword,
                role: admin.role || "TENANT_ADMIN",
            },
        });

        //generate token
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: tenant.id,
        });
        return {tenant, user, token};
    },

    login: async ({email, password}) => {
        const user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user) throw new Error("Invalid email or password");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid email or password");


        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
        });

        return {user, token};
    }

}