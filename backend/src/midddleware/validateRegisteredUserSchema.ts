/**
 * @file validateRegisteredUserSchema.ts
 * @module middleware
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * user registration data (sent via api from frontend) is validated and
 * sanitized against schema and
 * return error response as structured data as mentioned in product
 * requirements document.
 * If no error, then pass registration data to controller.
 *
 * @purpose
 * apply rules by schema definition (@see modules/auth/auth.schema.ts)
 * in schema validation middleware(@file validateRegisteredUserSchema.ts)
 *
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import type { ApiErrorResponse } from "../modules/auth/auth.types.ts";


export function validateRegisterUserSchema<T>(schema: ZodType<T>) {
  return (req: Request, resp: Response, next: NextFunction) => {
    console.log(req.body.email);
    console.log(JSON.stringify(req.body.email));
    const result = schema.safeParse(req.body)

    if (!result.success) {
      console.log("middleware: ", result.error.issues)


      let errorResponses: ApiErrorResponse = { error: [] };


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



        return resp.status(400).json(errorResponses)
      }
      req.body = result.data   // cleaned/normalized data
    }
    next()                   // ← IMPORTANT: pass to controller
  }
}
