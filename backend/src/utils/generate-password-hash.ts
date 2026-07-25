/**
 * @file generate-password-hash.ts
 * @module src/utils
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * Helper function to generate hashed password from raw password
 *
 *
 * @purpose
 * implement functions that can be reused for entire application
 *
 * @see DECISIONS_TAKEN.md — layered modular architecture
 * @see docs/auth-implementation-guide.md — auth API spec
 */

import * as argon2 from "argon2";
import { ServerInternalError } from "../modules/auth/auth.errors.ts";


/**
 * @description generate hash password to be stored in database at
 *              register of user and login of user
 * @param rawPassword
 * @returns
 */
export const generateHashedPassword = async (rawPassword: string) => {
    let hashedPassword: string;
    try {
        hashedPassword = await argon2.hash(rawPassword);
        return hashedPassword;
    } catch (err) {
        void err;
        throw new ServerInternalError();
    }
};
