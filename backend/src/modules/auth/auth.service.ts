/**
 * @file auth.service.ts
 * @module auth
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

// functionality implemented for auth
// 1. register user
// 2. login user
// 3. issue new refresh token
// 4. invalidate refresh token
// 5. return current authenticated user profile

import * as argon2 from "argon2";
import { ServerInternalError } from "./auth.errors.ts";
import { type userDBType, type RegisterUserInputType } from "./auth.types.ts";
/**
 * @description generate hash password to be stored in database at
 *              register of user and login of user
 * @param rawPassword
 * @returns
 */
const generateHashedPassword = async (rawPassword: string) => {
    let hashedPassword: string;
    try {
        hashedPassword = await argon2.hash(rawPassword);
        return hashedPassword;
    } catch (err) {
        void err;
        throw new ServerInternalError();

    }
};



/**
 * @description business logic to register user and store in database
 * @param userData
 * @returns
 */
export const registerUserService = async (userData: RegisterUserInputType) => {
    console.log("Register service executed", new Date().toISOString());


    // 1. assume more than 1 admins, so if role === admin then it can also register

    // 2. check email uniqueness


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

        //TODO: store data to database
        //Dummy data for testing only
        const userCreatedDBData = { id: "2232", full_name: "shobhit", role: "student" };
        // throw new MissingValuesError("id")
        return {
            "user": {
                "id": userCreatedDBData.id,
                "full_name": userCreatedDBData.full_name,
                "role": userData.role,
            }

        }

    } catch (err) {
        console.log("service catch block");
        throw err;
    }


}
