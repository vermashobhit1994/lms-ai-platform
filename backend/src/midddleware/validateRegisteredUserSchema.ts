/**
 * @file validate.ts
 * @module middleware
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 *
 *
 *
 * @purpose
 *
 *
 * @see DECISIONS_TAKEN.md — layered modular architecture
 * @see docs/auth-implementation-guide.md — auth API spec
 */

import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import type { ApiErrorResponse } from "../modules/auth/auth.types.ts";


export function validateRegisterUserSchema<T>(schema: ZodType<T>) {
  return (req: Request, resp: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      console.log("middleware: ", result.error.issues)

      // const fields = result.error;
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
      next()                   // ← IMPORTANT: pass to controller
    }
  }
}
