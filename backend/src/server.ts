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

//--------------------- cors related imports ------------------------
import cors from "cors";
import { corsConfigOptions } from './config/corsConfig.ts';
//--------------------------------------------------------------------

import { authRouter } from './modules/auth/auth.routes.ts';

import { appErrorHandler } from './midddleware/app_error_handler.ts';
import { logDebug, logError } from './utils/logger.ts';
import https from 'https';
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { env } from "./config/envConfig.ts";
import { userPool } from './config/databaseConfig.ts';
import { gracefulShutdown } from './utils/gracefulShutdown.ts';
import { fatalError } from './utils/fatalError.ts';

// *********************** Step1 - Debugging infrastructure issues ****************
// --------- register process-level event handlers ----

/**
 * @description detect whether server stopped due to
 *              debugger action, database problem, application error,
 *               manual stop(shutdown normally)
 * @note 0 -> normal exit, 1 -> error >1 -> abnormal termination
 */
process.on("exit", (code) => {
    logDebug("PROCESS EXIT:", code);
});

/**
 * @description detect server crashing issues
 */
process.on("uncaughtException", async (err) => {
    logError("UNCAUGHT EXCEPTION:", err);
    //
    fatalError('uncaughtException');
});

/**
 * @description detect bug for asynchronous errors(e.g. promise reject
 *              without being handled.)
*/
process.on("unhandledRejection", async (reason) => {
    logError("UNHANDLED REJECTION:", reason);
    fatalError('unhandledRejection');

});

/**
 * @description detect interrupt (Ctrl + c) signal
 */
process.on("SIGINT", async () => {
    logDebug("SIGINT");
    gracefulShutdown("SIGINT");
});

/**
 * @description detect other process terminate server process i.e.
 *              docker, kubernetes, PM2, systemd, cloud providers
 */
process.on("SIGTERM", async () => {
    logDebug("SIGTERM");
    gracefulShutdown("SIGTERM");
});
//*****************************************************************

// Step2 - create a server
const app: Express = express();

/**
 * @description detect what request actually reached server from client
 * @note used for debugging to detect which API endpoint client called
 * and what HTTP method used
 */
app.use((req: Request, res: Response, next: NextFunction) => {
    void res;
    logDebug(`${req.method} HTTPS method - request url from client:  ${req.protocol}://${req.get("host")}${req.originalUrl} `);

    next();
});

// Step3 - prevent Express-specific vulnerabilities or misconfigurations.
//         by disabled "X-Powered-By: Express" HTTP header
app.disable("x-powered-by");

// Step4 - enable canonical url to enable fixed endpoints of REST API
app.enable("strict-routing");


// Step5 - execute cors for every request for frontend to enable origins
app.use(cors(corsConfigOptions));

// Step6 - register cookie-parser middleware before routes/middleware
//         to access refresh token
app.use(cookieParser());

/**
 * @description detect what origin and cookies client(browser) is
 * sending to server
 * @note used for debugging cors and cookies related issues
 */
app.use((req: Request, res: Response, next: NextFunction) => {
    void res;
    logDebug("client Origin:", req.headers.origin);
    logDebug(`client cookie: ${req.headers.cookie}`,);
    next();
});


// Step7 - register JSON body parser before routes/middleware
app.use(express.json());

// step8 - enabled to trust proxy forwarded headers and use it to
//         determine original client information (client IP and
//         other details).
//         used when application is behind trusted reverse proxy (e.g.
//         Nginx, cloudflare, AWL ALB, Render, Railway)
//         NOTE: used to store real user's IP address in sessions or
//               refresh token instead of proxy IP
app.set("trust proxy", true);

// Step9 - break down routes into auth specific routes
app.use("/api/v1/auth", authRouter);


// Step10 - global error handler registered in server
app.use(appErrorHandler);

// TLS certificate and private key for encrypted HTTPS server connections
const httpsOptions = {
    key: fs.readFileSync(path.resolve("certs/key.pem")),
    cert: fs.readFileSync(path.resolve("certs/cert.pem")),
};


// Step11 - start HTTPS server application and listen for request on port
// wrap Express app in an HTTPS server
const server = https.createServer(httpsOptions, app)



// handle server level errors
// e.g. port already in use, insufficient permissions, TLS loading issues,
//      socket errors
server.on("error", async (err) => {
    logError("Server error ", err);
    try {
        await userPool.end();
        logDebug("Database pool closed");
    } catch (dbErr) {
        logError("Failed to close database pool", dbErr);
    }

    process.exit(1);
});


const protocol = "https";

// listen for encrypted connections
server.listen(
    env.SERVER_PORT,
    env.SERVER_HOST,
    () => {
        const serverData = server.address();
        if (serverData && typeof serverData !== "string") {
            logDebug(`${protocol} server running at https://${serverData.address}:${serverData.port}`);
            logDebug(`${protocol} server running at https://${env.SERVER_HOST}:${serverData.port}`);
        } else {
            process.exit(0);
        }
    }
);
