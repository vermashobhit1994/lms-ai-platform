/**
 * @file accessTokenController.test.ts
 * @module tests/auth
 * @product LMS-AI Platform
 * @company Vertexon Learning Technologies Pvt Ltd
 * @copyright 2026 Vertexon Learning Technologies Pvt Ltd. Proprietary and confidential.
 * @license UNLICENSED — see LICENSE.md at repository root.
 *
 * @description
 *
 * @purpose
 *
 * @see TECHNICAL_DECISIONS_ASSUMPTIONS.md
 * technical decisions & assumptions taken while structuring
 * and architecture design of backend
 *
 * @see docs/api-spec.yaml
 * How to use API contract as per OpenAPI specification
 * @todo add description and purpose
 */

import { Request, Response, NextFunction } from "express";
import { accessTokenController } from "../../src/modules/auth/auth.controller";
import { describe, it, expect, jest } from "@jest/globals";

describe("accessTokenController", () => {

    it("should return access token with status 200", async () => {

        const req = {
            cookies: {
                refresh_token: "abc123",
            },
        } as Partial<Request>;

        const json = jest.fn();

        const status = jest.fn().mockReturnValue({
            json,
        });

        const res = {
            status,
        } as unknown as Response;

        const next = jest.fn();

        await accessTokenController(
            req as Request,
            res,
            next
        );

        expect(status).toHaveBeenCalledTimes(1);

        expect(status).toHaveBeenCalledWith(200);

        expect(json).toHaveBeenCalledTimes(1);

        expect(json).toHaveBeenCalledWith({
            access_token: "access token received",
        });

        expect(next).not.toHaveBeenCalled();
    });



});
