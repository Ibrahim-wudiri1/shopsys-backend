// import { jwt } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

// const {jwt} = pkg;
export const signToken = (payload) =>{
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "7d"});
};