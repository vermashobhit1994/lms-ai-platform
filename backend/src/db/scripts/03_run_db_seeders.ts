/**
 * @file 03_run_db_seeders.ts
 * @module db/scripts
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
import { Pool } from "pg";
import fs from "node:fs/promises";
import "dotenv/config";

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
async function runSeeders() {
    console.log("run seeders");
    try {
        const sql = await fs.readFile(
            "src\\db\\seeders\\001_user_roles.sql",
            "utf8");
        await pool.query(sql);
    }
    finally {
        await pool.end();
    }
}
runSeeders().catch((err) => {
    console.error(err);
    process.exit(1);
});
