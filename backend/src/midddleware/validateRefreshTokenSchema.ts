import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import type { ApiErrorResponseType } from "../modules/auth/auth.types.ts";
import { logDebug, logError } from "../utils/logger.ts";
import { ValidationError } from "../modules/auth/auth.errors.ts";


export function validateRefreshTokenSchema<T>(schema: ZodType<T>,) {
    return (req: Request, resp: Response, next: NextFunction) => {
        console.log("validateRefreshTokenSchema cookie", req.cookies);
        const result = schema.safeParse(req.cookies);

        if (!result.success) {

            let errorResponses: ApiErrorResponseType = {
                error: [],
            };

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
                    new ValidationError(errorResponses.error)
                );
            }
        }

        logDebug("validateRefreshTokenSchema success", result.data);

        // Store the cleaned / normalized data
        req.body = result.data;

        next();
    };
}
