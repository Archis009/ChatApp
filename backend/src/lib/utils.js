import jwt from "jsonwebtoken";
import {ENV} from "./env.js";

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = ENV; 
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured")
    }
    // creating token for user 
    const token = jwt.sign({userId}, JWT_SECRET, {
        expiresIn: "7d"
    })

    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: ENV.NODE_ENV === "production" ? "strict" : "lax", 
        secure: ENV.NODE_ENV !== "development"
    };
    console.log("Setting cookie with options:", cookieOptions);

    res.cookie("jwt", token, cookieOptions); 

    return token; 
}