import { Pool} from "pg";


import dotenv from "dotenv";
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


export async function checkDBConnection() {
    userPool.query("SELECT 1 AS STATUS", (err, resp) => {
        if (err) {
            throw new Error(err.message)
        }
        else if (resp.rows[0].status === 1) {
            console.log(`${process.env.DB_NAME} database connected successfully `);
        }


    });
    // await userPool.end()
}
