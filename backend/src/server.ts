/**
 * @file server.ts
 * @module backend/src
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 * It contains application-level configuration and has following responsiblities
 * 1. create express application
 * 2. load environment variables
 * 3. register middleware (security, global etc)
 * 4. register routers
 * 5. CORS
 * 6. Error handling i.e register global error handler
 * 7. Server listening
 * 8. register 404 handler
 *
 * @purpose
 * starts and assemble application i.e. application entry point.
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 *
 */

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { checkDBConnection } from "./config/database.ts"

import cors from "cors";

import { corsConfigOptions } from './config/corsConfig.ts';
import { authRouter } from './modules/auth/auth.routes.ts';

import { appErrorHandler } from './midddleware/app_error_handler.ts';


// Step1 - check for database connection
await checkDBConnection()

// Step2 - create a server
const app: Express = express();
const port = process.env.SERVER_PORT;

// Step3 - apply cors once globally to enable cors for frontend to enable origins
app.use(cors(corsConfigOptions))

// Step4 - register JSON body parser before routes/middleware
app.use(express.json());

// Step5 - break down routes into auth specific routes
app.use("/api/v1/auth", authRouter);

// Step6 - global error handler registered in middleware
app.use(appErrorHandler);

app.listen(port, () => {
    console.log(`Backend Express server listening on port ${port}`);
});
