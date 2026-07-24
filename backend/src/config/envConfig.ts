/**
 * @file envConfig.ts
 * @module config
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * checking undefined type for Typescript when importing environment variables
 * (for a npm package) for handling undefined type because Typescript can't
 * guarantee that environment variable exists because
 * environment variables type can be (datatype | undefined), where datatype
 * can be any valid custom or typescript data type
 *
 *
 * @purpose
 * environment configuration module that validate all required variables
 * once application starts.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

import 'dotenv/config';

import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.string().min(1),
    DB_PORT: z.coerce.number(),
    DATABASE_URL: z.url(),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_ACCESS_TTL: z.string().min(2),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number(),
    CORS_ORIGIN_DEVELOPMENT: z.url(),
    CORS_ORIGIN_BUILD: z.url(),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_HOST: z.string().min(1),
    SERVER_PORT: z.coerce.number(),
    DB_ADMIN_NAME: z.string().min(1),
    DB_VERSION: z.coerce.number().min(2),

    DEFAULT_ADMIN_EMAIL: z.email(),
    DEFAULT_ADMIN_PASSWORD: z.string().min(12),
    DEFAULT_ADMIN_NAME: z.string().min(1),
});

export const env = envSchema.parse(process.env)
