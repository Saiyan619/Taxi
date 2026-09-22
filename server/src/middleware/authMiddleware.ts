import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const jwtMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Fetch the authorization header
  const authHeader = req.headers['authorization'];
  
  // 2. Validate format and check if it starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: Missing or malformed token.' });
  }
  const token = authHeader.split(' ')[1];
  let jwt_secret = process.env.JWT_SECRET;
    let jwt_expires_in = process.env.JWT_EXPIRES_IN;
    if (!jwt_secret) {
        throw new Error("jwt secret is undefined")
    }
    
    if (!jwt_expires_in) {
        throw new Error("jwt limit is undefined")
    }
    const payload = jwt.verify(token, jwt_secret)
    req.user = payload
    next();
    } catch (error) {
      return res.status(401).json({ message: 'Access Denied: Invalid or expired token.' });
    }
}