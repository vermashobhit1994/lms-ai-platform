import { logDebug, logError } from "./logger.ts";
import { userPool } from "../config/databaseConfig.ts";

/**
 *
 * @param signal
 */
export async function gracefulShutdown(signal: string) {
    logDebug(`${signal} received`);

    try {
        await userPool.end();
        logDebug("Database pool closed");
    } catch (err) {
        logError("Error closing database pool", err);
    }

    process.exit(0);
}
