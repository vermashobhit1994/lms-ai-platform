/**
 * @file 04_create_admin_user.ts
 * @module db/scripts
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 *
 *
 * @purpose
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 *
 */
import fs from "node:fs/promises";
import { dbPool } from "../../config/database.ts";
import "dotenv/config";
import { generateHashedPassword } from "../../utils/generate-password-hash.ts";
import { env } from "../../config/envConfig.ts";

/**
 * @description
 */
const createAdminUser = async () => {
    const filePath = "J:\\projects\\internmo\\lms-ai-platform\\backend\\src\\db\\seeders\\002_user_admin.sql";
    try {


        const sql = await fs.readFile(filePath, "utf-8");

        const passwordHash = await generateHashedPassword(env.DEFAULT_ADMIN_PASSWORD);
        console.log(passwordHash);
        await dbPool.query(sql, [
            env.DEFAULT_ADMIN_NAME,
            env.DEFAULT_ADMIN_EMAIL,
            passwordHash
        ])
    } finally {
        dbPool.end();
    }
};

/**
 * @description
 */
createAdminUser().catch((err) => {
    console.error(err);
    process.exit(1);
});
