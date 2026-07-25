/**
 * @file loggerConfig.ts
 * @module config
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * This file answer below question
 * "How should logging behave?"
 * by creating logging configuration once and use it in every file.
 *
 * @purpose
 * It's an architectural decision that makes logging consistent across
 * application because it follows Separations of concerns and avoid below
 * problems
 * 1. Duplicate configuration
 * 2. Hard to maintain
 * 3. Easy for configurations to become inconsistent
 * 4. Every file create a new logger instance
 *
 * The below are solutions provided
 * 1. Consistency - every log has same format and destinations
 * 2. Maintainability - one place to change log levels, formats or transports
 * 3. Reusuability - controllers, services, repositories and middleware all use
 *                   same logger.
 * 4. Performance - single configured logger instance is reused instead of
 *                  creating new ones repeatedly.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */


/**
 * @description global exports for logging library
 */
import { createLogger, format, transports } from "winston";

/**
 * @description create a logger and write to console in json format
 *              and to file simulataneously
 */
export const logger = createLogger({
    level: "debug",
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.metadata(),
        format.prettyPrint()
    ),


    transports: [
        new transports.Console(),
        new transports.File({ filename: "combined.log" }),
        new transports.File({
            filename: "error.log",
            level: "error",
        }),
    ],
});
