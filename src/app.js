import express from "express";
import cors from "cors";
import router from "./routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { PrismaClient } from '@prisma/client';



export const createApp = () =>{


// Use global singleton for Prisma (very important for Vercel serverless)
    const prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    });

    if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
    }

    const app = express();

// Middleware
    app.use(cors({
    origin: ['https://shopsys-six.vercel.app', 'http://localhost:5000', 'http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
    }));
    app.use(express.json());
    app.use("/api", router);
    app.use(errorHandler);

    return app;
    
};