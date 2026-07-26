/**
 * @file auth.service.ts
 * @module auth
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * application logic that store client data to database
 *
 *
 * @purpose
 * Separate business logic from HTTP and database concerns and implement
 * business rules.
 * Implement reusuability of service layer by
 * 1. giving flexibility in changing API
 *
 * @see DECISIONS_TAKEN.md — layered modular architecture
 * @see docs/auth-implementation-guide.md — auth API spec
 */

// TODO: functionality implemented for auth
// 1. register user - done
// 2. login user
// 3. issue new refresh token
// 4. invalidate refresh token
// 5. return current authenticated user profile

import { type userDBType, type RegisterUserInputType, type LoginUserInputType, type LoginUserDBType, type loginUserResponseType } from "./auth.types.ts";
import { createUserDB, findUserByEmailDB, storeHashRefreshTokenDB } from "./auth.repository.ts";
import { logDebug, logError } from "../../utils/logger.ts";
import { generateHashedPassword } from "../../utils/generate-password-hash.ts";
import * as argon2 from "argon2";
import { AccountDisableError, InvalidCredentialsError, SesssionCreationError, TokenGenerationError } from "./auth.errors.ts";
import crypto from "node:crypto";
import { SignJWT } from "jose";
import { env } from "../../config/envConfig.ts";

//TODO: add documentation for register user service
/**
 * @description business logic to register user and store in database
 * @param userData
 * @returns
 */
export const registerUserService = async (userData: RegisterUserInputType) => {


    // 1. assume more than 1 admins, so if role === admin then it can also register

    // 2. check email uniqueness - done in validate schema


    // 2. store hashed password to database
    const hashedPassword = await generateHashedPassword(userData.password);


    // 3. store data in database
    const userDBData: userDBType = {
        "fullName": userData.full_name,
        "email": userData.email,
        "hashedPassword": hashedPassword,
        "role": userData.role
    };
    try {
        logDebug("before calling createUserDB ", userDBData);

        const userCreatedDBData = await createUserDB(userDBData);
        logDebug("after calling createUserDB", userCreatedDBData);

        return {
            "user": {
                "id": userCreatedDBData.id,
                "full_name": userCreatedDBData.full_name,
                "role": userData.role,
            }

        }

    } catch (err) {
        logError("registerUserService Error ", err);
        throw err;
    }


}

const createSessionService = () => {
    // 1. generate secure session ID
    const sessionID = crypto.randomBytes(32).toString('hex');

    // 2. session model
    interface SessionData {
        userId: string;

        roles: string[];

        createdAt: number;

        expiresAt: number;

        ipAddress: string;

        userAgent: string;
    }

    // 3. store session

}

const generateAccessToken = async (user) => {
    try {

        const secretKey = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
        // JWT payload are Base64Url-encoded not encrypted
        const accessToken = await new SignJWT({
            roles: user.role
        })
            .setProtectedHeader({
                alg: "HS256"
            })
            .setSubject(user.id)
            .setIssuedAt()
            .setIssuer("lms-ai-api")
            .setAudience("lms-ai-web")
            .setExpirationTime(env.JWT_ACCESS_TTL)
            .sign(secretKey);

        if (!env.JWT_ACCESS_SECRET) {
            throw new Error("JWT_ACCESS_SECRET is not configured.");
        }

        return accessToken;
    } catch (err) {
        logError("access token generation error: ", err)
        throw new TokenGenerationError();
    }
}


/**
 *
 * @param userData
 * @returns
 */
export const loginUserService = async (userInputData: LoginUserInputType, userAgent, userIP):
    Promise<loginUserResponseType> => {
// 1. validate request i.e. user provided email id and password
// 2. find user i.e. find user email id, hashed password for active account
// 3. verify password using hashed password
// 4. check account status
// 5. create session
// 6. Load roles & responsibilities
// 7. build login response


    const loginUserResponseData = {
        "access_token": "eyJhbGciOi...",
        "refresh_token": "dGhpc2lzYXJl...",
        "user": { "id": "uuid", "full_name": "Ananya Sharma", "role": "student" }
    }

    // Step1 - Validate Input - already done in *.routes.ts file


    // Step2 - verify email
    const userEmail = userInputData.email;
    const userDBData = await findUserByEmailDB(userEmail);
    console.log(userDBData);
    if (!userDBData) {
        logError("invalid email", userDBData);
        throw new InvalidCredentialsError();
    }

    // ---------------------------------------------------------------
    // Step3 - verify password
    // ---------------------------------------------------------------
    const isPasswordValid = await argon2.verify(userDBData.password_hash,
        userInputData.password);
    if (!isPasswordValid) {
        logError("invalid password", userDBData);
        throw new InvalidCredentialsError();
    }

    // ---------------------------------------------------------------
    // Step4 - check account status
    // ---------------------------------------------------------------
    if (!userDBData.is_active) {
        logError("account disabled", userDBData);
        throw new AccountDisableError();
    }

    //--------------------------------------------------------
    // Step 5 - Load roles
    //--------------------------------------------------------

    const userRole = userDBData.role;


    //--------------------------------------------------------
    // Step 6
    // TODO - Create session
    // 1. generate access token - using jose
    // 2. generate cryptographically secure refresh token
    // 3. store hashed refresh token
    // 4. implement /auth/login
    // 5. implement /auth/refresh (verify, rotate, issue new access token)
    // 6. implement /auth/logout (revoke, delete refresh token)
    // 7. implement authentication middleware (verify access token)
    // 8. implement RBAC middleware

    //--------------------------------------------------------


    // 1. generate access token - using jose by sign with Signing key
    const userAccessToken = await generateAccessToken(userDBData);
    console.log("gnerated access token: ", userAccessToken);

    // 2. generate refresh token - using crypto module
    const userRefreshToken = crypto.randomBytes(32).toString("base64");

    // 3. store hashed refresh token
    // 3.1 generate hashed refresh token
    const tokenHash = crypto
        .createHash("sha256")
        .update(userRefreshToken)
        .digest("hex");

    // 3.2 store hashed refresh token in database
    const expiresAt = new Date(
        new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    )
    console.log(expiresAt, userAgent, userIP.split(":").at(-1))
    const refreshSessionInput = {
        userId: userDBData.id,
        tokenHash: tokenHash,
        expiresAt: expiresAt,
        userAgent: userAgent,
        ipAddress: userIP
    }
    try {

        const result = await storeHashRefreshTokenDB(refreshSessionInput);
    } catch (err) {
        throw new SesssionCreationError();
    }


    // const session = await sessionService.create(user.id);

    // create refresh session
    // createRefreshSession()
    // generate access token

    // store refresh token in Redis Database



    //--------------------------------------------------------
    // Step 6
    // Build response
    //--------------------------------------------------------

    return {
        access_token: userAccessToken,
        refresh_token: userRefreshToken,

        user: {
            id: userDBData.id,
            full_name: userDBData.full_name,
            role: userRole
        }
    };





    // JwT - signing, verifying tokens, JWT claims set validation
    // encrypted JSON web tokens
    // decrypting JSON web tokens

    // 1. generate hashed password for user input password and check it
    //    against hashed password stored in database
    // failure -> return error structure output
    // success -> move to next step

    // 2. generate JWT token by sign using secret/private key
    // 2.1 generate secret


}
