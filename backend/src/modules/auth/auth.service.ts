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

import { type userDBType, type RegisterUserInputType, type LoginUserInputType } from "./auth.types.ts";
import { createUserDB } from "./auth.repository.ts";
import { logDebug, logError } from "../../utils/logger.ts";
import { generateHashedPassword } from "../../utils/generate-password-hash.ts";

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

export const loginUserService = async (userData: LoginUserInputType) => {
    const loginUserResponseData = {
        "access_token": "eyJhbGciOi...",
        "refresh_token": "dGhpc2lzYXJl...",
        "user": { "id": "uuid", "full_name": "Ananya Sharma", "role": "student" }
    }

    return loginUserResponseData
}
