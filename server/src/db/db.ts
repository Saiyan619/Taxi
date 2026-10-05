import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
dotenv.config();
import * as schema from "./schema.js"

// const queryClient = postgres(process.env.DATABASE_URL!);
const queryClient = postgres(process.env.DB_POOLED_URL!);
export const db = drizzle(queryClient, { schema, logger:true });