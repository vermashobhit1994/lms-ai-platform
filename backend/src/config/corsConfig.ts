/**
 * @file corsConfig.ts
 * @module config
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description enable cors for frontend to enable origins
 *
 * @purpose configuration options for cors npm package to enable CORS
 *          for specific routes.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

import { env } from "./envConfig.ts"
/**
 * @description define configuration options for cors to enable url
 *              access by client
 */
export const corsConfigOptions = {
    //TODO: change to domain url i.e. https://app.yourdomain.com
    origin: [env.CORS_ORIGIN_DEVELOPMENT, env.CORS_ORIGIN_BUILD],
    credentials: true,
    optionsSuccessStatus: 200
}
