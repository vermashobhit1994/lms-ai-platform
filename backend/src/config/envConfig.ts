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

const CORS_ORIGIN_DEVELOPMENT = process.env.CORS_ORIGIN_DEVELOPMENT;
const CORS_ORIGIN_BUILD = process.env.CORS_ORIGIN_BUILD;

if (!CORS_ORIGIN_DEVELOPMENT) {
    throw new Error("CORS_ORIGIN_DEVELOPMENT is missing");
}

if (!CORS_ORIGIN_BUILD) {
    throw new Error("CORS_ORIGIN_BUILD is missing");
}

export const env = {
    CORS_ORIGIN_DEVELOPMENT,
    CORS_ORIGIN_BUILD
};
