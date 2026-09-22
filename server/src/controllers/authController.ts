import { Request, Response } from "express"
import { db } from "../db/db.js"
import { passwordResetTokens, refreshTokens, users } from "../db/schema.js"
import { comparePassword, compareToken, hashPassword, hashToken } from "../utils/passwordHash.js"
import { email, z } from 'zod';
import crypto from "crypto";
import { sendRequestPassResetEmail, sendVerificationEmail } from "../utils/email.js";
import { generateVerificationToken } from "../utils/token.js";
import { findUserByEmail, findUserByToken } from "./userController.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken, getJwtExpiryMs } from "../utils/jwt.js";

const RegisterUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(6, 'Password must be at least 6 characters long')
})

const LoginUserSchema = z.object({
    email: z.email(),
    password: z.string().min(6, 'Password must be at least 6 characters long')
})

const requestResetUserSchema = z.object({
    email: z.email(),
})

const passwordResetUserSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const registerUser = async(req: Request, res: Response) => {
    try {
        const result = RegisterUserSchema.safeParse(req.body);
        if (!result.success) { return res.status(400).json({ message: "Validation failed", errors: result.error.flatten(), }); }
        const {name, email, password} = result.data;
        let hashedPass = await hashPassword(password);
        let token = generateVerificationToken();
        const ONE_HOUR = 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + ONE_HOUR);
        let oldUser = await findUserByEmail(email)
        if(oldUser){
            return res.status(403).json({message: "user already exists"});
        }
        const [user] = await db.insert(users).values(
            {   name, 
                email, 
                password_hash: hashedPass,
                token: token,
                token_expires_at: expiresAt,
            }
        ).returning({
            id: users.id,
            name: users.name, 
            email: users.email,
            created_at: users.created_at,
            updated_at: users.updated_at
        });
        if(user){
            try {
              await sendVerificationEmail(user.email, token);  
            } catch (error) {
                res.status(500).json({message: "Failed to send email message"})
            }
        }

        res.status(201).json(user)
    } catch (error: any) {
        // console.log(error)
        res.status(500).json({message: "Server failed"})
    }
}

export const verifyEmail = async(req: Request, res: Response) => {
    try {
        let {token} = req.body;
        if (typeof token !== 'string') {
            res.status(409).json({message: "invalid token format"})
        }
        // let user = getMeByToken(req, res, token)
        let user = await findUserByToken(token as string)
        if (!user){
            res.status(500).json();
        }

        if (!user.token_expires_at || user.token_expires_at < new Date()) {
            res.status(409).json({message: "token has expired"})
        }
        
        const [verify] = await db.update(users).set({
            verified: true,
            token: null
        }).where(eq(users.id, user.id)).returning({ id: users.id, email: users.email, verified: users.verified });
        res.status(200).json(verify);
    } catch (error) {
        console.log(error)
        res.status(500).json()
    }
}

export const loginUser = async(req: Request, res: Response) => {
    try {
        const jti = crypto.randomUUID() as string
        const result = LoginUserSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({message: "wrong validations"});
        }

        const {email, password} = result.data;
        
        let [user] = await db.select().from(users).where(eq(users.email, email))
        if(!user || typeof user.email !== "string" || user.verified == false){
            return res.status(401).json({message: "wrong login"})
        }
        let correctPassword = await comparePassword(password, user.password_hash)
        if(!correctPassword) {
            return res.status(401).json({message: "password does not match!!"})
        }
        const [refreshTk] = await db.insert(refreshTokens).values({
            jti: jti,
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + getJwtExpiryMs("REFRESH_JWT_EXPIRES_IN"))
        }).returning();
        let jwtToken = generateToken(user);
        let refreshJwtToken = generateRefreshToken(user, refreshTk.jti);
        console.log(jwtToken)
        console.log(refreshJwtToken)
        res.cookie("refreshToken", refreshJwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth",
        maxAge: getJwtExpiryMs("REFRESH_JWT_EXPIRES_IN"),
  });
        res.status(200).json({message: "login successfully",
                        token: jwtToken,
                        expiresIn: process.env.JWT_EXPIRES_IN,
                        refreshExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"})
    }
}

export const refreshToken = async(req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        let payload: { id: string, jti: string };
        try {
            payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: string, jti: string }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: "refresh token has expired, please log in again" });
            }
            return res.status(401).json({ message: "invalid refresh token" })
        }
        let [user] = await db.select().from(users).where(eq(users.id, payload.id))
        if(!user){
            return res.status(401).json({message: "user not found"})
        }
        const [refreshTk] = await db.select().from(refreshTokens).where(eq(refreshTokens.jti, payload.jti));
        if(!refreshTk){
            await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id)).returning()
            return res.status(403).json({message: "refresh_tokens deleted successfully, spotted token reuse and exploitation"});
        }
        if (new Date() > refreshTk.expiresAt) {
            console.log("token has expired")
            return res.status(403).json({message: "this refresh token is expired; try logging in again"})
        }
        await db.delete(refreshTokens).where(eq(refreshTokens.jti, refreshTk.jti))
        console.log("refreshtoken has been deleted succesfully");
        const newJti = crypto.randomUUID() as string
        const [newRefreshTk] = await db.insert(refreshTokens).values({
            jti: newJti,
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + getJwtExpiryMs("REFRESH_JWT_EXPIRES_IN"))
        }).returning();
        const newAccessToken = generateToken(user);
        let newRefreshJwtToken = generateRefreshToken(user, newRefreshTk.jti);
        console.log("new access token below")
        console.log(newAccessToken)
        console.log("new refreshtoken below")
        console.log(newRefreshJwtToken)
        res.cookie("refreshToken", newRefreshJwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/api/auth",
            maxAge: getJwtExpiryMs("REFRESH_JWT_EXPIRES_IN"),
        });
        return res.status(201).json({message: "accessToken restored successfully", accessToken: newAccessToken, expiresIn: process.env.JWT_EXPIRES_IN});
    
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "something went wrong with the token refresh and rotation"})        
    }
}

export const logout = async(req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        const payload = jwt.decode(token) as { id: string, jti: string };
        
        if (!payload) {
            return res.status(401).json({message: "invalid token"});
        }
        await db.delete(refreshTokens).where(eq(refreshTokens.jti, payload.jti)).returning();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/api/auth",
        });
        
        res.status(200).json({message: "user logged out, token cleared"});
    
    } catch (error) {
        return res.status(500).json({message: "something went wrong with logging out"})
    }
}

export const requirePasswordReset = async(req: Request, res: Response) => {
    try {
        const result = requestResetUserSchema.safeParse(req.body);
        if (!result.success) { return res.status(400).json({ message: "Validation failed", errors: result.error.flatten(), }); }
        const {email} = result.data;

        const [realUser] = await db.select().from(users).where(eq(users.email, email))
        if(!realUser){
            return res.status(403).json({message: "Unauthorized"})
        }

        // let token = generateVerificationToken();
        const TEN_MINUTES = 10 * 60 * 1000;
        const expiresAt = new Date(Date.now() + TEN_MINUTES);
        // Generate cryptographically secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Hash the token before storing in database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const [forgotPass] = await db.insert(passwordResetTokens).values({
            userId: realUser.id,
            passwordTokenHash: hashedToken,
            expiresAt: expiresAt
        }).returning()

            try {
              await sendRequestPassResetEmail(realUser.email, token);  
            } catch (error) {
                return res.status(500).json({message: "Failed to send email message"})
            }

        return res.status(201).json({message: "password reset request has been sent"});

    } catch (error) {
        return res.status(500).json({message: "something went wrong with password reset"})
    }
}


export const ResetForgotPassword = async(req: Request, res: Response) => {
    try {
        const {token} = req.params;
        const result = passwordResetUserSchema.safeParse(req.body);
        if (!result.success) { return res.status(400).json({ message: "Validation failed", errors: result.error.flatten(), }); }
        const {password} = result.data;

        if (!token) {
            return res.status(401).json({message: "token doesnt exist"});
        }
        // Hash the received token to compare with database
        const hashedToken = crypto.createHash("sha256").update(token as string).digest("hex");

        const [forgotPass] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.passwordTokenHash, hashedToken));
        if (!forgotPass ||  forgotPass.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid or expired token", success: false });
        }

        let hashedPassword = await hashPassword(password);
        const [user] = await db.update(users).set({
            password_hash: hashedPassword
        }).where(eq(users.id, forgotPass.userId)).returning();
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, forgotPass.id)).returning();

        await db.delete(refreshTokens).where(eq(refreshTokens.userId, forgotPass.userId)).returning();

        return res.status(201).json({message: "Password reset succesful"})
        
    } catch (error) {
        res.status(500).json({message: "something went wrong with password reset"})
    }
}