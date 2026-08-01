/**
 * @file logger.ts
 * @module utils
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * application logging API for hiding or showing logs as per log level,
 * whether in production mode or development mode.
 * SHOWS ERROR LOGS BOTH IN PRODUCTION AND DEVELOPMENT MODE
 *
 * @purpose
 * Expose logging functions for applications to hide logging implementation
 * in application and help in maintainability of code by
 * 1. flexibility in changing logging library
 * 2. flexiblility in changing log structure
 * The above is done as per "separation of concerns"
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */


import { logger } from "../config/loggerConfig.ts";
import { env } from "../config/envConfig.ts";

const isDevelopment = env.NODE_ENV === "development";


export function logDebug(message: string, meta?: unknown) {
    if (!isDevelopment) return;

    if (meta === undefined) {
        logger.debug({ message });
        return;
    }
    logger.debug({ message, meta });
}

export function logInfo(message: string, meta?: unknown) {
    if (!isDevelopment) return;

    if (meta === undefined) {
        logger.info({ message });
        return;
    }
    logger.info({ message, meta });
}

export function logWarn(message: string, meta?: unknown) {
    if (!isDevelopment) return;
    if (meta === undefined) {
        logger.warn({ message });
        return;
    }
    logger.warn({ message, meta });
}

export function logError(message: string, meta?: unknown) {
    if (meta === undefined) {
        logger.error({ message });
        return;
    }
    logger.error({ message, meta });
}
