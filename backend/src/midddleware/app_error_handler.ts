/**
 * @file app_error_handler.ts
 * @module middleware
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * auth module specific error Handler, when route gets matched but some
 * error occurs
 *
 * @purpose
 * one centralized place to convert application errors into HTTP responses,
 * to prevent duplicating of error-handling logic inside every controller
 *
 * format and return all HTTP error responses and has below responsiblities
 * 1. every endpoint return same error format
 * 2. consistent error format i.e. guarantee of single consistent contract
 * 3. Easier maintenance,if API specification error handler changes,
 *    so modification is needed only one file and not every controller.
 * 4. security i.e. prevent revealing implementation details in server
 *    For e.g. duplicate keys error in database is logged on server and
 *             conver to safe application error
 *             (e.g. UserAlreadyExistsError)
 * 5. observability i.e. other modules (for e.g. logging, metrics, tracing,
 *    alerting) can be added in one middleware instead of scattered
 *    across database.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 *
 */


import { type Response, type Request, type NextFunction } from "express";
import { AppError, ValidationError, DatabaseUnavailableError } from "../modules/auth/auth.errors.ts";

/**
 * @description handle application error when route in server matched
 * @param err
 * @param req
 * @param resp
 * @param next
 * @returns error JSON data in structured format for HTTP request
 */
import { logger } from "../config/loggerConfig.ts";
export function appErrorHandler(
    err: Error,
    req: Request,
    resp: Response,
    next: NextFunction) {

    void next;
    void req;

    logger.error("global error handler:", err)

    if (err instanceof ValidationError) {
        return resp.status(err.statusCode).json({
            error: err.errors
        });
    }

    if (err instanceof DatabaseUnavailableError) {
        return resp.status(503).json({
            error: {
                code: err.code,
                message: err.message
            }
        });
    }

    if (err instanceof AppError) {
        return resp.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                field: err.field
            },
        });
    }
    return resp.status(500).json({
        error: {
            code: "INTERNAL_SEVER_ERROR",
            message: "Something went wrong",
        }
    });
}
