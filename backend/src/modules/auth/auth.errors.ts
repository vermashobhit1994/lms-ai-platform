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
        this.name = this.constructor.name;

        this.field = field;

    }
}
/**
 * @description
 */
export class UserAlreadyExistsError extends AppError {
    constructor(field: string) {
        super(409, "EMAIL_ALREADY_EXISTS", "User with this Email already exists", field)
    }
}

export class ServerInternalError extends AppError {
    constructor() {
        super(500, "INTERNAL_SERVER_ERROR", "Internal error in server occurs. Please try again later")
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



export class InvalidReferenceError extends AppError {
    constructor() {
        super(
            400,
            "INVALID_REFERENCE",
            "Reference resource doesn't exists"
        );
    }
}

export class InvalidRequestError extends AppError {
    constructor() {
        super(
            400,
            "INVALID_REQUEST",
            "One or more required fields are missing"
        )
    }
}
export class InvalidInputError extends AppError {
    constructor() {
        super(
            400,
            "INVALID_INPUT",
            "Invalid Input data"
        )
    }
}
export class ConcurrentModificationError extends AppError {
    constructor() {
        super(
            409,
            "CONCURRENT_MODIFICATION",
            "The request conflicted with another operation. Please retry"
        )
    }
}
export class ServiceUnavailableError extends AppError {
    constructor() {
        super(
            503,
            "SERVICE_UNAVAILABLE",
            "Service temporarily unavailable. Please retry"
        )
    }
}

export class RequestTimeoutError extends AppError {
    constructor() {
        super(
            503,
            "REQUEST_TIMEOUT",
            "Request timed out. Please try again."
        )
    }
}

export class DatabaseUnavailableError extends AppError {
    constructor() {
        super(
            503,
            "SERVER_UNAVAILABLE",
            "Service temporarily unavailable."
        );
    }
}

export class InvalidCredentialsError extends AppError {
    constructor() {
        super(
            401,
            "INVALID_CREDENTIALS",
            "Invalid Email or Password. Please register if you haven't"
        )
    }
}

export class AccountDisableError extends AppError {
    constructor() {
        super(
            401,
            "ACCOUNT_DISABLED",
            "You don't have permissions to access account"
        )
    }
}

export class TokenGenerationError extends AppError {
    constructor() {
        super(
            500,
            "INTERNAL_SERVER",
            "Internal server error"
        )
    }
}

export class SesssionCreationError extends AppError {
    constructor() {
        super(
            500,
            "LOGIN_INCOMPLETE",
            "Unable to complete login, Please try again"
        )
    }
}

export class UnauthorizedError extends AppError {
    constructor() {
        super(
            401,
            "LOGIN_INCOMPLETE",
            "Unable to login. Please try again"
        )
    }
}
