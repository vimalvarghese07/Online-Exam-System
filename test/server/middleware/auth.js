import jwt from "jsonwebtoken";
const { verify } = jwt;
import ENV from "../config.js";

export default async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = await verify(token, ENV.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Authentication failed!" });
    }
}

export function localVariable(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next();
}