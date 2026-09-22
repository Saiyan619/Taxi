import { eq } from "drizzle-orm"
import { db } from "../db/db.js"
import { users } from "../db/schema.js"
import { Request, Response } from "express";


export const findUserByToken = async(token: string) => {
    try {
        let [user] = await db.select().from(users).where(eq(users.token, token))
        return user
    } catch (error) {
        throw error
    }
}
export const findUserByEmail = async(email: string) => {
    try {
        let [user] = await db.select().from(users).where(eq(users.email, email))
        return user
    } catch (error) {
        console.log(error)
    }
}


// export const getMeByToken = async(req: Request, res: Response, token: string) => {
//     try {
//         const [user] = await db.select().from(users).where(eq(users.token, token)).limit(1);
//         res.status(201).json(user);
//         // 3. Added safety check for when no user matches the token
//         if (!user) {
//             return res.status(404).json({ message: "User not found with this token." });
//         }
        
//         // 2. Changed status from 201 to 200
//         return res.status(200).json(user);
//     } catch (error:any) {
//        console.log(error)
//         res.status(500).json({message: error.message})
//     }
// }

export const getUser = async(req: Request, res: Response) => {
    try {
        // Extracted user from the jwtMiddleware
        let Exuser = req.user;
        if(!Exuser){
            return res.status(404).json({message: "user is not authenticated"});
        }
        const [user] = await db.select({id: users.id, name: users.name, email: users.email, createdAt: users.created_at, updatedAt: users.updated_at}).from(users).where(eq(users.id, Exuser.id))
        if (!user) {
  return res.status(404).json({message: "user not found"});
}
        res.status(200).json({message: "user found", user: user})
    } catch (error) {
        return res.status(500).json({message: "something went wrong finding user"})
    }
}