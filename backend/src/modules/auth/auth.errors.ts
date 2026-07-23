/**
 * @file auth.errors.ts
 * @module auth
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * global error handler
 *
 * @purpose
 * Error object to handle runtime errors.
 * user-defined exceptions handled by Error object
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

import type { ValidationIssueType } from "./auth.types.ts";

export class AppError extends Error {
    // read-only modifier Instance fields
    readonly statusCode: number;
    readonly code: string;
    readonly field?: string;

    // constructor
    constructor(
        statusCode: number,
        code: string,
        message: string,
        field?: string,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;

        // assign Error object name to improve
        // stack traces, server logs, error monitoring tools, debugging,
        // console output
        this.name = this.constructor.name;

        this.field = field;

    }
}

export class UserAlreadyExistsError extends AppError {
    constructor(field: string) {
        super(409, "EMAIL_ALREADY_EXISTS", "User with this Email already exists", field)
    }
}
export class MissingValuesError extends AppError {
    constructor(field: string) {
        super(409, "MISSING_VALUES", "Please provide all the required values", field)
    }
}

export class ServerInternalError extends AppError {
    constructor() {
        super(500, "INTERNAL_SERVER_ERROR", "Internal error in server occurs. Please try again later")
    }
}

export class DBWriteError extends AppError {
    constructor() {
        super(409, "DB_WRITE_ERROR", "user data can't write in database")
    }
}


export class ValidationError extends AppError {
    // instance property
    public readonly errors: ValidationIssueType[];
    constructor(errors: ValidationIssueType[]) {
        super(
            400,
            "VALIDATION_ERROR",
            "Validation failed for registration of user",
        );
        this.errors = errors;
    }
}
