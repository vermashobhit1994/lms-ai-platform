/**
 * @file auth.controller.ts
 * @module auth
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * Read Request via HTTP -> call service -> return HTTP response
 * Why to put business logic separate?
 * because api changes often more (for eg from REST API to GraphQL to grpc) than
 * business logic.
 * It also follows Single Responsibility principle i.e.
 * Which URL calls which controller?
 *
 * @summary
 * Tasks done by controller
 * 1. return HTTP status code
 * 2. return JSON response
 * 3. return cookies
 * 4. return headers
 * 5. redirect to other URL
 *
 * @purpose
 * translate HTTP requests into application actions(business logic),
 * and then translate the result back into HTTP response.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

// TODO: functionality implemented for auth
// 1. register user - done
// 2. login user
// 3. issue new refresh token
// 4. invalidate refresh token
// 5. return current authenticated user profile


// calls service using req body
import type { Request, Response, NextFunction } from "express";
import { type RegisterUserInputType, type RegisterUserResponseType } from "./auth.types.ts";
import { registerUserService } from "./auth.service.ts";
import { logDebug, logError } from "../../utils/logger.ts";

//TODO: add documentation for function
/**
 * @description Read validated and verified data, then call service for
 *              processing data and then send response
 * @param req
 * @param resp
 * @param next
 */
export async function registerUserController(req: Request, resp: Response, next: NextFunction) {

    // 1. Read validated and verified data
    const registerUserInputData: RegisterUserInputType = req.body;


    // 2. call service
    try {
        logDebug("registerUserController before calling service", registerUserInputData);
        const registerUserResponseData: RegisterUserResponseType = await registerUserService(registerUserInputData)
        logDebug("registerUserController after calling service", registerUserResponseData);

        // throw new UserAlreadyExistsError("email");
        resp.status(201).json(registerUserResponseData);
    } catch (err) {
        logError("registerUserController error", err)
        next(err);
    }

}
