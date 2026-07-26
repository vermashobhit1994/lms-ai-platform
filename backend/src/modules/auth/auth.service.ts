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
import { createUserDB, findUserByEmailDB } from "./auth.repository.ts";
import { logDebug, logError } from "../../utils/logger.ts";
import { generateHashedPassword } from "../../utils/generate-password-hash.ts";
import * as argon2 from "argon2";
import { AccountDisableError, InvalidCredentialsError } from "./auth.errors.ts";

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
 *
 * @param userData
 * @returns
 */
export const loginUserService = async (userInputData: LoginUserInputType):
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
    // Step 5
    // TODO - Create session
    //--------------------------------------------------------

    // const session = await sessionService.create(user.id);



    //--------------------------------------------------------
    // Step 5
    // TODO
    // Load roles
    //--------------------------------------------------------

    const userRole = userDBData.role;

    //--------------------------------------------------------
    // Step 6
    // Build response
    //--------------------------------------------------------

    return {
        access_token: "access-token",
        refresh_token: "refresh-token",

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
