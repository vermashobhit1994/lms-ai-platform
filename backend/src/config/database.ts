import { Pool} from "pg";


import dotenv from "dotenv";
import { DatabaseUnavailableError } from "../modules/auth/auth.errors.ts";
import { type Request, type Response, type NextFunction } from "express";
dotenv.config();


const port = Number(process.env.DB_PORT);
if (Number.isNaN(port)) {
    throw new Error(`DATABASE PORT is invalid`);
}

const userPoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
};
export const userPool = new Pool(userPoolConfig);


export async function checkDBConnection(req: Request,
    resp: Response, next: NextFunction
) {
    try {

        await userPool.query("SELECT 1 AS STATUS");

        // console.log(`${process.env.DB_NAME} database connected successfully `);
        next();
    } catch (err) {
        // console.error("Database unavailable:", err);

        next(new DatabaseUnavailableError());
    } finally {
        // userPool.end();
    }

}
