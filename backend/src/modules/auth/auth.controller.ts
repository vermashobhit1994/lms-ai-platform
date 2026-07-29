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
import { type LoginUserInputType, type LoginUserResponseType, type RegisterUserInputType, type RegisterUserResponseType } from "./auth.types.ts";
import { loginUserService, refreshTokenService, registerUserService } from "./auth.service.ts";
import { logDebug, logError } from "../../utils/logger.ts";
import { env } from "../../config/envConfig.ts";

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

//TODO: add documentation for function
/**
 * @description
 * @param req
 * @param resp
 * @param next
 */

export async function loginUserController(req: Request, resp: Response, next: NextFunction) {

    logDebug("login user controller");

    // 1. Read validated and verified data
    const loginUserInputData: LoginUserInputType = req.body;

    // 2. call service
    try {
        logDebug("loginUserController before calling service", loginUserInputData);
        logDebug("loginUserController req.headers ", req.headers);
        logDebug("loginUserController - req.ip ", req.ip);
        logDebug("loginUserController req.socket.remoteAddress ", req.socket.remoteAddress);
        logDebug("loginUserController ", req.headers['x-forwarded-for']);
        const userAgent = req.headers['user-agent']
        const userIP = req.ip;

        const loginUserResponseData: LoginUserResponseType = await loginUserService(
            loginUserInputData, userAgent, userIP)
        logDebug("loginUserController after calling service", loginUserResponseData);

        logDebug("refresh token: ", loginUserResponseData.refresh_token);

        //3. store refresh token in cookie
        //   refresh token is sent in response header
        resp.cookie("refresh_token", loginUserResponseData.refresh_token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            path: env.COOKIE_API_PATH,
            maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000, // 7 days
        });



        resp.status(200).json({
            "access_token": loginUserResponseData.access_token,
            "user": {
                "id": loginUserResponseData.user.id,
                "full_name": loginUserResponseData.user.full_name,
                "role": loginUserResponseData.user.role
            }
        });


    } catch (err) {
        logError("loginUserController error", err)
        next(err);
    }


}

/**
 *
 * @param req
 * @param resp
 * @param next
 */
export const accessTokenController = async (req: Request, resp: Response, next: NextFunction) => {


    logDebug("accessTokenController cookie", req.cookies);


    try {

        // Step1 - validation of refresh token - already done in middleware
        // Step2 - read middleware value instead of directly read from
        //          req.cookies.refresh_token
        const oldRefreshToken = req.body.refresh_token;


        /*
            below are steps done
            1. validate session
            2. rotate refresh token
            3. generate access token
        */
        const userAgent = req.headers['user-agent'];
        const userIP = req.ip;
        const { accessToken, refreshToken } = await refreshTokenService(oldRefreshToken, userAgent, userIP)

        // 4. set cookie
        resp.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: env.COOKIE_API_PATH,
            maxAge:
                env.REFRESH_TOKEN_TTL_DAYS *
                24 *
                60 *
                60 *
                1000,
        });


        // 5. return response
        resp.status(200).json({
            access_token: accessToken,
        });

    } catch (err) {
        logError("accessTokenController error", err);
        throw err;
    }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function logoutController(
    req: Request,
    resp: Response,
    next: NextFunction
) {
    try {
        // const { refreshToken } = req.cookies;
        logDebug("logoutController data ", req.cookies.refresh_token);


        return resp.status(200).json(
            { message: 'logout controller working ' }
        );

    } catch (err) {
        console.error("logoutController error", err);

    }
}
