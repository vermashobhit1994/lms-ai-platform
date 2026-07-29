/**
 * @file authenticate.ts
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

import {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import { jwtVerify } from "jose";
import { ProfileAccessError, UnauthorizedError } from "../modules/auth/auth.errors.ts";
import { env } from "../config/envConfig.ts";
import { logDebug, logError } from "../utils/logger.ts";


/* Middleware steps
    1. Request
    2. Helmet
    3. CORS
    4. JSON parser
    5. Request Logger
    6. Routes
    7. Validation
    8. Authentication
    9. Authorization
    10. Controller
    11. Error handler
*/
export async function authenticateUser(req: Request,
    res: Response,
    next: NextFunction) {

    try {


        // 1. Read authorization header
        // 2. Extract JWT
        // 3. Verify JWT signature
        // 4. validate JWT claims
        // 5. Put authenticated user on req.user

        const authHeader = req.headers.authorization;
        logDebug("authenticate user", req.headers);
        logDebug("authenticate user", req.header('Authorization'));

        if (!authHeader) {
            throw new UnauthorizedError();
        }

        if (!authHeader?.startsWith("Bearer ")) {
            console.error("token doesn't start with 'Bearer'")
            throw new ProfileAccessError({
                code: 'PROFILE_ACCESS_ERROR',
                message: 'Server error when accessing user profile'
            });
        }

        const token = authHeader.split(" ")[1]

        const secret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

        const { payload } = await jwtVerify(
            token,
            secret,
            {
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE
            }
        );
        logDebug("JWT payload", payload)


        res.locals.user = {
            id: payload.sub,
            role: payload.role,
            sessionId: payload.sid,
        };

        return next();
    } catch (err) {
        logError("JWT verification failed", err);
        return next(new ProfileAccessError({
            code: 'PROFILE_ACCESS_ERROR',
            message: 'Server error when accessing user profile'
        }));
    }
}
