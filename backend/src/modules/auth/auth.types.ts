/**
 * @file auth.types.ts
 * @module auth
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * define shared Typescript types and interfaces for below types
 * 1. Request types
 * 2. Response types
 * 3. Error types
 * 4. Enums or Union types
 * 5. Database row types
 *
 *
 * @purpose
 * define shared Typescript types and interfaces used in auth module and
 * avoid duplicating object shapes across multiple files by reusing in
 * multiple files.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 *
 */


export interface ApiErrorType {
    code: string;
    message: string;
    field?: string;
}

export interface ApiErrorResponseType {
    error: ApiErrorType[];
}
export interface RegisterUserInputType {
    full_name: string;
    email: string;
    password: string;
    role: string;
}

export interface RegisterUserResponseType {
    user: {
        id: string;
        full_name: string;
        role: string;
    }
}

export interface ValidationIssueType {
    code: string;
    message: string;
    field?: string;
}
export interface userDBType {
    "fullName": string;
    "email": string;
    "hashedPassword": string;
    "role": string;
}

export interface LoginUserInputType {
    email: string;
    password: string;
}
export interface LoginUserDBType {
    id: string;
    full_name: string;
    email: string;
    password_hash: string;
    is_active: boolean;
    role: string;
};
export interface LoginUserResponseType {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        full_name: string;
        role: string;
    }
}
