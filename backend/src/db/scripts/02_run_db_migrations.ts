import { Pool } from "pg";
import fs from "node:fs/promises";
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
console.log("run seeders");
async function runSeeders() {
    try {
        let sql = await fs.readFile(
            "src\\db\\migrations\\001_enable_extensions.sql",
            "utf8");
        await pool.query(sql);

        sql = await fs.readFile(
            "src\\db\\migrations\\002_create_users.sql",
            "utf8");
        await pool.query(sql);

        sql = await fs.readFile(
            "src\\db\\migrations\\003_create_roles.sql",
            "utf8");
        await pool.query(sql);

        sql = await fs.readFile(
            "src\\db\\migrations\\004_create_user_roles_mappings.sql",
            "utf8");
        await pool.query(sql);

        sql = await fs.readFile(
            "src\\db\\migrations\\005_create_refresh_tokens.sql",
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
