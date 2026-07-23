/**
 * @file auth.routes.ts
 * @module auth
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * Defines HTTP routes for authentication (register, login, refresh, logout, me).
 * Mount point: `/api/v1/auth` (see server.ts).
 *
 * @purpose
 * Keeps URL wiring in one place; delegates business logic to controller/service.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */


import express, { type Request, type Response, type NextFunction } from 'express';
import { registerUserSchema } from './auth.schema.ts';
import { validateRegisterUserSchema } from '../../midddleware/validateRegisteredUserSchema.ts';
export const authRouter = express.Router();

function authRouterHandler(req: Request, resp: Response, next: NextFunction) {
    console.log("auth router working...")
    return resp.status(200).json({
        message: "Auth router working success"
    })
}

// TODO: implement schema validation
authRouter.post("/register", validateRegisterUserSchema(registerUserSchema), authRouterHandler);

// TODO: implement login route
// TODO: implement schema validation

// TODO: implement refresh route because it issues new access token
// TODO: implement schema validation

// TODO: implement logout route because it invalidates refresh token
// TODO: implement schema validation

// TODO: implement me route because it return current authenticated user profile
// TODO: implement schema validation
