/**
 * @file validateRefreshTokenSchema.test.ts
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

import { describe, it, expect, jest } from "@jest/globals";
import { Request, Response } from "express";
import { z } from "zod";
import { validateRefreshTokenSchema } from "../../src/midddleware/validateRefreshTokenSchema.ts";
import { ValidationError } from "../../src/modules/auth/auth.errors.ts";


describe("validateRefreshTokenSchema", () => {

    it("should validate a valid refresh token", () => {

        const schema = z.object({
            refresh_token: z.string().min(1),
        });

        const middleware =
            validateRefreshTokenSchema(schema);

        const req = {
            cookies: {
                refresh_token: "abc123",
            },
            headers: {
                cookie: "refresh_token=abc123",
            },
            body: {},
        } as Partial<Request>;

        const res = {} as Response;

        const next = jest.fn();

        middleware(req as Request, res, next);

        expect(req.body).toEqual({
            refresh_token: "abc123",
        });

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });


    it("should reject request when refresh token cookie is missing", () => {
        const schema = z.object({
            refresh_token: z.string().min(1),
        });

        const middleware = validateRefreshTokenSchema(schema);

        const req = {
            cookies: {},
            body: {},
        } as Partial<Request>;

        const res = {} as Response;

        const next = jest.fn();

        middleware(req as Request, res, next);

        expect(next).toHaveBeenCalledTimes(1);

        expect(next.mock.calls[0][0]).toBeInstanceOf(ValidationError);
    });

    it("should reject empty refresh token", () => {

        const schema = z.object({
            refresh_token: z.string().min(1),
        });

        const middleware =
            validateRefreshTokenSchema(schema);

        const req = {
            cookies: {
                refresh_token: "",
            },
            body: {},
        } as Partial<Request>;

        const res = {} as Response;

        const next = jest.fn();

        middleware(req as Request, res, next);

        expect(next).toHaveBeenCalled();

        expect(next.mock.calls[0][0])
            .toBeInstanceOf(ValidationError);
    });

});
