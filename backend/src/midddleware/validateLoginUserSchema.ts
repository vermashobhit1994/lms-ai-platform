import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import type { ApiErrorResponseType } from "../modules/auth/auth.types.ts";
import { ValidationError } from "../modules/auth/auth.errors.ts";
import { logDebug, logError } from "../utils/logger.ts";

//TODO: adding documentation for schema
/**
 * @description
 * @param schema
 * @returns
 */

export function validateLoginUserSchema<T>(schema: ZodType<T>) {
    return (req: Request, resp: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {


            let errorResponses: ApiErrorResponseType = { error: [] };


            if (result.error.issues?.length > 0) {
                errorResponses = {
                    error: result.error.issues.map((issue) => ({
                        code: issue.code.toUpperCase(),
                        message: issue.message.includes(": ")
                            ? issue.message.split(": ")[1]
                            : issue.message,
                        field: issue.path[0]?.toString(),
                    }))
                }


                logError("validateLoginUserSchema error", result);

                return next(
                    new ValidationError(
                        errorResponses.error
                    )
                );
            }

        }
        logDebug("validateLoginUserSchema success", result.data);
        req.body = result.data   // cleaned/normalized data
        next()                   // ← IMPORTANT: pass to controller
    }
}
