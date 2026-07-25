/**
 * @file auth.repository.ts
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


import { DatabaseUnavailableError, UserAlreadyExistsError } from "./auth.errors.ts";
import {
    InvalidReferenceError, ServerInternalError, InvalidRequestError
    , InvalidInputError, ConcurrentModificationError, ServiceUnavailableError,
    RequestTimeoutError, ValidationError
} from "./auth.errors.ts";

// create one pool for lifetime of application
import { userPool } from "../../config/databaseConfig.ts";
import { Result } from "pg";
import type { userDBType } from "./auth.types.ts";
import { logger } from "../../config/loggerConfig.ts";
import { logDebug } from "../../utils/logger.ts";
/**
 * @description
 * @returns
 */
const checkDB = async () => {
    try {

        const dbCheckResult = await userPool.query(`
        SELECT current_database(),
               current_user,
               version(),
               inet_server_port();`);
        const dbCheck = dbCheckResult.rows[0];

        if ((dbCheck.current_database !== process.env.DB_NAME) &&
            (dbCheck.current_user !== process.env.DB_USER) &&
            (dbCheck.inet_server_port !== Number(process.env.DB_PORT))
        ) {
            throw new ServerInternalError();
        }
    } catch (err) {
        void err;
        throw new ServerInternalError();
    }

}

const columnToField: Record<string, string> = {
    full_name: "full_name",
    email: "email",
    password_hash: "password",
    role_id: "role",
    instructor_id: "instructorId",
    course_id: "courseId",
};
function getClientField(column?: string): string | undefined {
    if (!column) return undefined;
    return columnToField[column];
}

/**
 * @description
 * @param userData
 * @returns
 */
export const createUserDB = async (userData: userDBType) => {
    await checkDB();

    const userFullName = userData.fullName;
    const userEmail = userData.email;
    const userHashedPassword = userData.hashedPassword;
    const userRole = userData.role;
    logDebug("createUserDB", userData);

    let userDBProfileResult: Result | null;
    let userDBRoleResult: Result | null;
    try {
        userDBProfileResult = await userPool.query(
            `INSERT INTO users (full_name, email, password_hash)
        VALUES($1::varchar, $2::varchar, $3::varchar)
        RETURNING id, full_name, email
        `,
            [userFullName, userEmail, userHashedPassword]);
        if (userDBProfileResult !== null) {
            if (userDBProfileResult.rowCount !== 1) {
                throw new Error("user data not inserted");
            }
        }
        const userDBID = userDBProfileResult.rows[0].id;

        userDBRoleResult = await userPool.query(
            `INSERT INTO user_roles (user_id, role_id)
                 VALUES ($1::UUID, (SELECT id FROM roles WHERE name = $2::varchar))
             `,
            [userDBID, userRole])
        void userDBRoleResult;

    } catch (err: unknown) {
        // Handle only couple of errrors and rest all errors considered as
        // "Unexpected internal server error"
        logger.error("Error writing database ", err);
        switch (err.code) {

            case "23505": {
                // checking for duplicate fields in table
                const temp = err.detail.split(")=");
                const field = temp[0].substring("Key (".length);
                throw new UserAlreadyExistsError(field);
            }
            case "23503": {
                // invalid user id and role id
                throw new InvalidReferenceError();
            }
            case "42P01": {
                throw new ServerInternalError();
            }
            case "23502":
                throw new ValidationError([
                    {
                        code: "REQUIRED",
                        field: getClientField(err.column),
                        message: "A required field is missing.",
                    },
                ]);

            case "22001":
                throw new ValidationError([
                    {
                        code: "MAX_LENGTH_EXCEEDED",
                        field: getClientField(err.column),
                        message: "Value exceeds the maximum allowed length.",
                    },
                ]);

            case "23514":
                throw new ValidationError([
                    {
                        code: "INVALID_VALUE",
                        field: getClientField(err.column),
                        message: "Invalid value provided.",
                    },
                ]);
            case "22P02":
            case "22003": {
                throw new InvalidInputError();
            }
            case "40001": {
                throw new ConcurrentModificationError();
            }
            case "40P01": {
                throw new ServiceUnavailableError();
            }
            case "57014": {
                throw new RequestTimeoutError();
            }
            case "08006":
            case "57P01":
            case "53300":
            case "28P01":
            case "3D000": {
                throw new DatabaseUnavailableError();
            }
            default:
                throw err;

        }


    }

    logDebug("createUserDB success", userDBProfileResult.rows[0]);
    // *.repository file should return database data on success
    return userDBProfileResult.rows[0];
}
