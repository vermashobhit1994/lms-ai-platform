/**
 * @file 03_run_db_seeders.ts
 * @module db/scripts
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * Initialize database with predefined values to populate and write data by user
 *
 *
 * @purpose
 * populate database with initial or sample data after database schema
 * (tables, indexes, constraints) have been created.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

import fs from "node:fs/promises";
import "dotenv/config";
import { dbPool } from "../../config/databaseConfig.ts";

async function runSeeders() {
    console.log("run seeders");
    try {
        const sql = await fs.readFile(
            "src\\db\\seeders\\001_user_roles.sql",
            "utf8");
        await dbPool.query(sql);
    }
    finally {
        await dbPool.end();
    }
}
runSeeders().catch((err) => {
    console.error(err);
    process.exit(1);
});
