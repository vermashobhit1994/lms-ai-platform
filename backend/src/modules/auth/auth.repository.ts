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


import { DatabaseUnavailableError, SesssionCreationError, UnauthorizedError, UserAlreadyExistsError } from "./auth.errors.ts";
import {
    InvalidReferenceError, ServerInternalError, InvalidRequestError
    , InvalidInputError, ConcurrentModificationError, ServiceUnavailableError,
    RequestTimeoutError, ValidationError
} from "./auth.errors.ts";

import * as argon2 from "argon2";

// create one pool for lifetime of application
import { userPool } from "../../config/databaseConfig.ts";
import { DatabaseError, Result } from "pg";
import { type LoginUserDBType, type sessionDBInputType, type userDBType, type UserSessionType } from "./auth.types.ts";
import { logger } from "../../config/loggerConfig.ts";
import { logDebug, logError } from "../../utils/logger.ts";
import { error } from "node:console";
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


/**
 * @description retrieve user data from database
 * @param userEmail
 * @param userHashPassword
 * @returns
 * @note handle Unexpected / System errors (e.g. database connection failed,
 *        SQL syntax error, timeout) to implement separation of responsibilities
 */
export const findUserByEmailDB = async (userEmail: string):
    Promise<LoginUserDBType | null> => {
    try {
        // Step1 - return fields to verify password and email id for active user
        const sqlQuery = `SELECT
                            u.id,
                            u.full_name,
                            u.email,
                            u.password_hash,
                            u.is_active,
                            r.name AS role
                        FROM users u
                        INNER JOIN user_roles ur
                            ON u.id = ur.user_id
                        INNER JOIN roles r
                            ON ur.role_id = r.id
                        WHERE u.email = $1
                        LIMIT 1;`;
        const userDBResult = await userPool.query<LoginUserDBType>(sqlQuery, [userEmail]) ?? null;
        if (userDBResult.rowCount === 0) {
            logError(`user doesn't exsits in database, ${userDBResult.command} SQL command failed`, userDBResult.rows)
            return null;
        }
        logDebug("findUserByEmail ", userDBResult.rows)
        // Step2 - return data
        return userDBResult.rows[0];
    } catch (err) {
        //TODO: catch error that occurs when querying database
        logError(`Failed to query user by email`, err);


        throw new DatabaseUnavailableError();
    }


}

export const storeHashRefreshTokenDB = async (session: sessionDBInputType):
    Promise<UserSessionType> => {

    try {
        logDebug("storeHashRefreshTokenDB", session);

        const sqlQuery = `INSERT INTO refresh_tokens (
                        user_id,
                        token_hash,
                        expires_at,
                        user_agent,
                        ip_address
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )
                    RETURNING id,token_hash,expires_at,user_agent,ip_address,revoked_at;`

        const refreshTokenResult = await userPool.query<UserSessionType>
            (sqlQuery, [
            session.userId,
            session.tokenHash,
            session.expiresAt,
            session.userAgent ?? null,
            session.ipAddress ?? null,
        ]);
        logDebug("new session data", refreshTokenResult.rows);
        if (refreshTokenResult.rowCount !== 1) {

            logDebug(`${refreshTokenResult.command} SQL command failed
                with data: ${refreshTokenResult.rows}`);
            throw new SesssionCreationError();
        }
        return refreshTokenResult.rows[0];
    } catch (err) {
        logError("storeHashRefreshTokenDB failed ", err);
        throw new SesssionCreationError();
    }


}

/**
 *
 * @param refreshTokenHash
 * @returns
 */
export async function findSessionByRefreshTokenHashDB(
    refreshTokenHash: string
) {
    try {
        const query = `
        SELECT
            id,
            user_id,
            token_hash,
            expires_at,
            revoked_at
        FROM refresh_tokens
        WHERE token_hash = $1
        LIMIT 1
    `;

        const { rows } = await userPool.query(query, [refreshTokenHash]);
        logDebug("findSessionByRefreshTokenHash: ", rows);
        return rows[0] ?? null;
    } catch (err) {
        logError("findSessionByRefreshTokenHash ", err)
        throw new SesssionCreationError();
    }
}

/**
 *
 * @param userId
 * @returns
 */
export async function findUserAuthInfoByIdDB(userId: string) {
    try {
        const query = `
                        SELECT
                    u.id,
                    u.full_name,
                    u.email,
                    u.is_active,
                    r.name AS role
                FROM users u
                INNER JOIN user_roles ur
                    ON u.id = ur.user_id
                INNER JOIN roles r
                    ON ur.role_id = r.id
                WHERE u.id = $1
                LIMIT 1;
                `;

        const { rows } = await userPool.query(query, [userId]);
        logDebug("findUserByID rows", rows);
        return rows[0];
    } catch (err) {
        logError("findUserByID error", err);
        throw new SesssionCreationError();
    }
}

/**
 *
 * @param sessionId
 * @returns
 */
export async function revokeCurrentSessionDB(sessionId: string) {
    try {

        const query = `
                       UPDATE refresh_tokens
                        SET revoked_at = NOW()
                        WHERE id = $1
                        AND revoked_at IS NULL
                        RETURNING revoked_at;
                    `;

        const { rows } = await userPool.query(query, [
            sessionId
        ]);
        logDebug("revokeCurrentSessionDB: ", rows);
        return rows[0];
    } catch (err) {
        logError("revokeCurrentSessionDB error", err);
        throw new UnauthorizedError();
    }
}
