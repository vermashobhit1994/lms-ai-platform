/**
 * @file 01_create_empty_db.ts
 * @module db/scripts
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * !!WARNING - destroy existing Database
 * Create Empty database by running migration script used to create empty database
 *
 * @purpose
 * Administrative & Architecture decision to separate database
 * provisioning from database schema management as per Single
 * Responsibility Principle Software guideline
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

import "dotenv/config";
import { Pool } from "pg";
import fs from "node:fs/promises";
import { env } from "../../config/envConfig.ts";


const adminPool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,

    // IMPORTANT
    database: env.DB_ADMIN_NAME,
});

/**
 * @description create empty database using default database credentials
 */
async function createEmptyDatabase() {

    try {
        let filePath = "src\\db\\scripts\\01_create-empty-database\\01_terminate_connections.sql"
        let sql = await fs.readFile(filePath, "utf-8");
        let finalSql = sql.replaceAll(
            "{{DB_NAME}}",
            env.DB_NAME
        );
        await adminPool.query(
            finalSql);

        filePath = "src\\db\\scripts\\01_create-empty-database\\02_drop_database.sql"
        sql = await fs.readFile(filePath, "utf-8");
        finalSql = sql.replaceAll(
            "{{DB_NAME}}",
            env.DB_NAME
        );
        await adminPool.query(
            finalSql);

        filePath = "src\\db\\scripts\\01_create-empty-database\\03_create_database.sql"
        sql = await fs.readFile(filePath, "utf-8");
        finalSql = sql.replaceAll(
            "{{DB_NAME}}",
            env.DB_NAME
        );
        await adminPool.query(
            finalSql);
    } finally {
        await adminPool.end();
    }
}

createEmptyDatabase().catch((err) => {
    console.error(err);
    process.exit(1);
});
