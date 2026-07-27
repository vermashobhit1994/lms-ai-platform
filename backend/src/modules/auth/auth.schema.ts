/**
 * @file auth.schema.ts
 * @module auth
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * define & validate schema when frontend sends data for registration of user,
 * because data format when received at api endpoint
 * `/api/v1/auth/register` must be in a structured format
 *
 *
 * @purpose
 * define and validate schema for data received at
 * api endpoint `/api/v1/auth/register`
 *
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 */

// define schema
import * as z from "zod";

// api data for registeration of user
// 1. data type check for each parameters in api
// 2. data normalization
//    2.1 email data normalization
//        - remove trailing whitespaces
//        - convert all characters to lowercase
//    2.2 full_name data normalization
//        - remove trailing whitespaces
//        - short full names of only 2 characters to block empty/junk names
//  3. password
//     - validate for data type
//     - validate for minimum and maximum length
//  4. role
//     - validate role against fixed set of allowable string values


export const registerUserSchema = z.strictObject({
  full_name: z.string().trim().min(2).max(150),
  email: z.preprocess((value) => typeof value === "string"
    ? value.trim().toLowerCase()
    : value,
    z.email().max(180)
  ),
  password: z.string().min(12).max(128),
  role: z.enum(['student', 'instructor', 'admin']),
});


export const loginUserSchema = z.strictObject({
  email: z.preprocess((value) => typeof value === "string"
    ? value.trim().toLowerCase()
    : value,
    z.email().max(180)
  ),
  password: z.string().min(12).max(128),
})

/**
 * @description validate http-only cookie (refresh token) coming from
 * client for below
 * 1. token exists
 * 2. token is a string
 * 3. not empty
 * 4. reasonable maximum length
 * @note assume refresh token was stored in HttpOnlyCookie and not in
 *       request body
 */

export const refreshTokenSchema = z.strictObject({
  refresh_token: z
    .string()
    .trim()
    .min(1, "Refresh token is required")
    .max(4096, "Refresh token is too long"),
});
