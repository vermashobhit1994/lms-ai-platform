import { logError } from "./logger.ts";
import { userPool } from "../config/databaseConfig.ts";
export async function fatalError(error: unknown) {
    logError("Fatal error", error);

    try {
        await userPool.end();
    } finally {
        process.exit(1);
    }
}
