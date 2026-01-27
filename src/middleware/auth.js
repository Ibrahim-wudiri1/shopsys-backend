import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
