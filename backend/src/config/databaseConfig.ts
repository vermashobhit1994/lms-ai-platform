/**
 * @file databaseConfig.ts
 * @module config
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 *
 * @purpose
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

import { Pool} from "pg";


import { DatabaseUnavailableError } from "../modules/auth/auth.errors.ts";
import { type Request, type Response, type NextFunction } from "express";
import { logDebug, logError } from "../utils/logger.ts";
import { env } from "./envConfig.ts";

/**
 * @description pool used for migration and seeder of database
 */
export const dbPool = new Pool({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
});

const port = Number(env.DB_PORT);
if (Number.isNaN(port)) {
    throw new Error(`DATABASE PORT is invalid`);
}

const userPoolConfig = {
    host: env.DB_HOST,
    user: env.DB_USER,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60,
    password: env.DB_PASSWORD,
    port: Number(env.DB_PORT),
    database: env.DB_NAME,
};
export const userPool = new Pool(userPoolConfig);


export async function checkDBConnection(req: Request,
    resp: Response, next: NextFunction
) {
    try {

        await userPool.query("SELECT 1 AS STATUS");
        logDebug("database checked success");
        return next();
    } catch (err) {
        logError("Database unavailable:", err);

        return next(new DatabaseUnavailableError());
    } finally {
        // userPool.end();
    }

}
