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

import {
    type userDBType, type RegisterUserInputType, type LoginUserInputType,
    type LoginUserDBType, type UserSessionType,
    type sessionDBInputType, type UserAuthInfoType, type ValidatedSessionType, GenerateAccessTokenPayload,
    type LoginUserResponseType
} from "./auth.types.ts";
import {
    createUserDB, findSessionByRefreshTokenHashDB, findUserAuthInfoByIdDB, findUserByEmailDB,
    revokeCurrentSessionDB, storeHashRefreshTokenDB
} from "./auth.repository.ts";
import { logDebug, logError } from "../../utils/logger.ts";
import { generateHashedPassword } from "../../utils/generate-password-hash.ts";
import * as argon2 from "argon2";
import { AccountDisableError, InvalidCredentialsError, SesssionCreationError, TokenGenerationError, UnauthorizedError } from "./auth.errors.ts";
import crypto from "node:crypto";
import { SignJWT } from "jose";
import { env } from "../../config/envConfig.ts";
import { RotateRefreshTokenInput, RotateRefreshTokenResult } from "./auth.types.ts";
/* TODO:
    AuthService services list
    1. login()
    2. logout()
    3. refresh()
    4. register()

    TokenService services list
    1. generateAccessToken()
    2. generateRefreshToken()
    3. verifyAccessToken()
    4. verifyRefreshToken()
    5. hashRefreshToken()

    PasswordService services list
    1. hashPassword()
    2. verifyPassword()


*/



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


/**
 * @note access token depend on role and session id
 */
const generateAccessToken = async ({ userId, role, sessionId }: GenerateAccessTokenPayload) => {
    try {

        const secretKey = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
        if (!env.JWT_ACCESS_SECRET) {
            logError("JWT_ACCESS_SECRET is not configured.");
            throw new TokenGenerationError();
        }

        // JWT payload are Base64Url-encoded not encrypted
        const accessToken = await new SignJWT({
            role: role,
            sid: sessionId
        })
            .setProtectedHeader({
                alg: "HS256"
            })
            .setSubject(userId)
            .setIssuedAt()
            .setIssuer(env.JWT_ISSUER)
            .setAudience(env.JWT_AUDIENCE)
            .setExpirationTime(env.JWT_ACCESS_TTL)
            .sign(secretKey);

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
export const loginUserService = async (userInputData: LoginUserInputType,
    userAgent: string, userIP: string):
    Promise<LoginUserResponseType> => {
// 1. validate request i.e. user provided email id and password
// 2. find user i.e. find user email id, hashed password for active account
// 3. verify password using hashed password
// 4. check account status
// 5. create session
// 6. Load roles & responsibilities
// 7. build login response

    // Step 1 Validate request for user provided email id and password
    // Step 2 Find user i.e. find user email id, hashed password for active account
    // Step 3 Verify password using hashed password
    // Step 4 Validate account
    // Step 5 Generate refresh token
    // Step 6 Create refresh session
    // Step 7 Generate access token
    // Step 8 Build response



    // ---------------------------------------------------------------
    // Step1 - Validate Input - already done in *.routes.ts file
    // ---------------------------------------------------------------


    // ---------------------------------------------------------------
    // Step2 - verify email
    // ---------------------------------------------------------------
    const userEmail = userInputData.email;
    const userDBData: LoginUserDBType | null = await findUserByEmailDB(userEmail);
    logDebug("loginUserService userDBData - ", userDBData);
    if (!userDBData) {
        //handle below conditions
        // condition 1 - user doesn't exsits i.e. no entry of user in database
        // condition 2 - user has provide invalid email or password or both
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


    // // ---------------------------------------------------------------
    // // Step5 - create session
    // // ---------------------------------------------------------------
    // const session = createSessionDB({
    //     userId: userDBData.id,
    //     userAgent: userAgent,
    //     ipAddress: userIP
    // });


    //--------------------------------------------------------
    // Step 6 - Load roles
    //--------------------------------------------------------

    const userRole = userDBData.role;

    //--------------------------------------------------------
    // Step 7 - generate cryptographically secure hashed refresh token
    //           and update session by storing token in database
    //--------------------------------------------------------

    // 1. generate refresh token - using crypto module
    const userRefreshToken = crypto.randomBytes(32).toString("base64");

    // 2. store hashed refresh token
    // 2.1 generate hashed refresh token
    const tokenHash = crypto
        .createHash("sha256")
        .update(userRefreshToken)
        .digest("hex");

    // 2.2 store hashed refresh token in database
    const expiresAt = new Date(
        new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    )
    logDebug("expiresAt ", expiresAt);
    logDebug("UserAgent ", userAgent);
    logDebug("userIP ", userIP);
    logDebug("userIP ", userIP.split(":").at(-1));
    const sessionDBInput: sessionDBInputType = {
        userId: userDBData.id,
        tokenHash: tokenHash,
        expiresAt: expiresAt,
        userAgent: userAgent,
        ipAddress: userIP
    }
    let userSession: UserSessionType;
    try {

        userSession = await storeHashRefreshTokenDB(sessionDBInput);

    } catch (err) {
        logError("Failed creating refresh session", err);

        throw new SesssionCreationError();
    }


    //--------------------------------------------------------
    // Step 7 - generate access token
    //--------------------------------------------------------
    const sessionId = userSession.id;
    //--------------------------------------------------------
    // 1. generate access token - using jose by sign with Signing key
    const userAccessToken = await generateAccessToken({
        userId: userDBData.id,
        role: userDBData.role,
        sessionId: sessionId
    });
    logDebug("gnerated access token: ", userAccessToken);




    // const session = await sessionService.create(user.id);

    // create refresh session
    // createRefreshSession()
    // generate access token

    // store refresh token in Redis Database



    //--------------------------------------------------------
    // Step 8
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
/**
 *
 * @param refreshToken
 * @returns
 */
function getHashedRefreshToken(refreshToken: string): string {

    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
}

/**
 * if session found
 * 1. not revoked.
 * 2. not expired
 * @param session
 */
function validateSessionState(session: UserSessionType) {

    if (!session ||
        session.revoked_at !== null ||
        session.expires_at.getTime() <= Date.now()) {
        throw new UnauthorizedError();
    }
}



/**
 * @description Take refresh token as input and return session by following steps
 *               1. Receive refresh token
 *               2. validate request
 *               3. find session
 *               4. validate session
 *
 * @param refreshToken
 */
async function validateRefreshToken(refreshToken: string):
    Promise<ValidatedSessionType> {
    // Step1 - hash token
    // convert refresh token to Hashed refresh token
    const refreshTokenHash = getHashedRefreshToken(refreshToken);
    logDebug("refresh token Hash: ", refreshTokenHash)

    // Step2 - find session
    // Find matching session
    const session: UserSessionType =
        await findSessionByRefreshTokenHashDB(refreshTokenHash);
    logDebug("validateRefreshToken session ", session);

    // Step3 - Validate session state i.e. is session still usuable
    /* if session found?
        1. Not revoked?
        2. Not expired?
        3. User still active?
    */
    // session exists, revoked, expired
    validateSessionState(session);
    // Step2-3: user still active?
    const user: UserAuthInfoType = await findUserAuthInfoByIdDB(session.user_id);
    if (!user || (!user.is_active)) {
        throw new UnauthorizedError();
    }


    // Step4 - return validated session
    return { session, user };
}

async function issueAccessTokenForSession(
    session: UserSessionType,
    user: UserAuthInfoType
): Promise<string> {
    // Step1 - get session data and user data for validated session

    // Step2 - generate and return access token
    try {

        const accessToken =
            await generateAccessToken({
                userId: user.id,
                role: user.role,
                sessionId: session.id,
            });
        return accessToken;
    } catch (err) {
        logError("refreshAccessToken", err);
        throw err;
    }

}





/**
 * @description
 * @param input
 * @returns
 * @note refresh token rotation means removing previous refresh token with
 *       new generate refresh token
 */
async function rotateRefreshToken(input: RotateRefreshTokenInput
): Promise<RotateRefreshTokenResult> {
    /*
        for an existing session
        1. generate new refresh token
        2. hash refresh token
        3. revoke old session
        4. create new session row
        5. return new session, plaintext refresh token

    */

    // 2.1 read input
    const { oldSession, userAgent, userIP } = input;

    // 2.2 generate refresh token - using crypto module
    const newRefreshToken = crypto.randomBytes(32).toString("base64");
    logDebug("new refresh token ", newRefreshToken);

    // 2.3 hash new refresh token
    const hashRefreshToken = getHashedRefreshToken(newRefreshToken);

    // 2.4 calculate new expiry
    const expiresAt = new Date(
        Date.now() +
        env.REFRESH_TOKEN_TTL_DAYS *
        24 *
        60 *
        60 *
        1000
    );


    // 2.5 revoke current session
    // mark current refresh token to be revoked by storing timestamp in
    // database
    const revokedSessionData = await revokeCurrentSessionDB(oldSession.id)
    logDebug(revokedSessionData);

    // 2.5 create new session
    const newSessionInput = {
        userId: oldSession.user_id,
        tokenHash: hashRefreshToken,
        expiresAt,
        userAgent: userAgent ?? null,
        ipAddress: userIP ?? null,
    };

    /*
        {
            id,
            user_id,
            expires_at,
            revoked_at
        }
    */
    const newSession = await storeHashRefreshTokenDB(newSessionInput)
    logDebug("newSession input", newSessionInput);
    if (!newSession) {
        throw new SesssionCreationError();
    }

    // 2.7 return plaintext refresh token
    return {
        refreshToken: newRefreshToken,
        session: newSession
    };

    // 2.6 generate new access token
    // NOTE: DON'T USE REVOKED SESSION ID

    // 2.7 send new refresh token as HTTP Only cookie


    // 2.8 return new access token

}


/**
 * @description business logic for /auth/refresh endpoint
 * @param refreshToken
 * @param userAgent
 * @param userIP
 * @returns
 */
export async function refreshTokenService(oldRefreshToken: string, userAgent: string, userIP: string) {
    // 1. validate session
    //    validateRefreshToken()

    // 2. rotate refresh token
    //    issueAccessTokenForSession()

    // 3. generate access token



    // 1. validate session
    const validatedSessionAndUserData = await validateRefreshToken(oldRefreshToken);
    const validatedSession = validatedSessionAndUserData.session;
    const activeUserData = validatedSessionAndUserData.user;


    logDebug("session data: ", validatedSession);
    logDebug("user data:", activeUserData);



    // 2. rotate refresh token
    // Rotate refresh token
    // update refresh tokens table
    // set new HTTPOnly Cookie

    const { refreshToken, session } = await rotateRefreshToken({
        oldSession: validatedSession,
        userAgent,
        userIP
    });
    logDebug("refreshTokenService , new refresh token", refreshToken)
    logDebug("new session", session);
    // 3. generate new access token
    const accessToken = await generateAccessToken({
        userId: activeUserData.id,
        role: activeUserData.role,
        sessionId: session.id
    });
    logDebug("new access token: ", accessToken);

    return { accessToken, refreshToken };
}
