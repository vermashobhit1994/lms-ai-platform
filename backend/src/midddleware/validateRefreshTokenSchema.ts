/**
 * @file validateRefreshTokenSchema.ts
 * @module middleware
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 *
 * @purpose
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 * @todo add description and purpose
 */

import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import type { ApiErrorResponseType } from "../modules/auth/auth.types.ts";
import { logDebug, logError } from "../utils/logger.ts";
import { ValidationError } from "../modules/auth/auth.errors.ts";


export function validateRefreshTokenSchema<T>(schema: ZodType<T>,) {
    return (req: Request, resp: Response, next: NextFunction) => {
        logDebug("validateRefreshTokenSchema cookie", req.cookies);
        logDebug("validateRefreshTokenSchema cookie", req.cookies.refresh_token);
        const result = schema.safeParse({ refresh_token: req.cookies.refresh_token });

        if (!result.success) {

            let errorResponses: ApiErrorResponseType = {
                error: [],
            };
            logError("validateRefreshTokenSchema error ", result.error)
            if (result.error.issues.length > 0) {

                errorResponses = {
                    error: result.error.issues.map((issue) => ({
                        code: issue.code.toUpperCase(),
                        message: issue.message.includes(": ")
                            ? issue.message.split(": ")[1]
                            : issue.message,
                        field: issue.path[0]?.toString(),
                    })),
                };

                logError("validateRefreshTokenSchema error", result.error);

                return next(
                    new ValidationError([{
                        code: "INVALID_REQUEST",
                        message: "Invalid request"
                    }])
                );
            }
        }

        logDebug("validateRefreshTokenSchema success", result.data);

        // Store the cleaned / normalized data
        req.body = result.data;

        next();
    };
}
