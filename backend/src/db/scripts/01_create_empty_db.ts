import "dotenv/config";
import { Pool } from "pg";




const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_ADMIN_NAME,
});

async function createEmptyDatabase() {

    try {
        await pool.query(
            `SELECT pg_terminate_backend(pid)
                 FROM pg_stat_activity
                 WHERE datname = $1
                 AND pid <> pg_backend_pid();
                 `,
            [process.env.DB_NAME]);
        await pool.query(
            `DROP DATABASE IF EXISTS "${process.env.DB_NAME}";`);
        await pool.query(
            `CREATE DATABASE  "${process.env.DB_NAME}";`,);

    } finally {
        await pool.end();
    }
}

createEmptyDatabase().catch((err) => {
    console.error(err);
    process.exit(1);
});
