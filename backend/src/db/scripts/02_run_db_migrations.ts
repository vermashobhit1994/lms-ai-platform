/**
 * @file 02_run_db_migrations.ts
 * @module db/scripts
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * Manage Schema changes using ALTER statements after initial schema is
 * created.
 *
 * @purpose
 * Used to manage changes to database schema over time in a safe,
 * repeatable and version-controlled way.
 * It contains ALTER statements after initial schema is created.
 * It provides
 * 1. Version control - every schema change is tracked in Git.
 * 2. Consistency - development, staging and production use same schema
 * 3. Repeatability - any new environment can be setup the same way.
 * 4. Safe evolution - Database change incrementally without loosing
 *                     exsiting data.
 * 5. Rollback support - revert schema changes if deployment fails
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */


import fs from "node:fs/promises";
import { dbPool } from "../../config/databaseConfig.ts";
import { logDebug, logError } from "../../utils/logger.ts";

/**
 * @description run all migration scripts to create tables and fields
 */
async function runDBMigrations() {
    //TODO: handle error when migration is run twice
    logDebug("running Database migrations");

    try {
        let sql = await fs.readFile(
            "src\\db\\migrations\\001_enable_extensions.sql",
            "utf8");
        await dbPool.query(sql);

        sql = await fs.readFile(
            "src\\db\\migrations\\002_create_users.sql",
            "utf8");
        await dbPool.query(sql);

        sql = await fs.readFile(
            "src\\db\\migrations\\003_create_roles.sql",
            "utf8");
        await dbPool.query(sql);

        sql = await fs.readFile(
            "src\\db\\migrations\\004_create_user_roles_mappings.sql",
            "utf8");
        await dbPool.query(sql);

        sql = await fs.readFile(
            "src\\db\\migrations\\005_create_refresh_tokens.sql",
            "utf8");
        await dbPool.query(sql);

    }
    finally {
        await dbPool.end();
    }
}
runDBMigrations().catch((err) => {
    logError(err);
    process.exit(1);
});
