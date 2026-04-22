import { FastifySchema } from "fastify";

export const localUserSchema: FastifySchema = {
    response: {
        200: {
            type: "object",
            additionalProperties: false,
            required: ["githubId", "login", "avatar"],
            properties: {
                githubId: { type: "string" },
                login: { type: "string" },
                name: { type: "string", nullable: true },
                avatar: { type: "string", format: "uri" },
            },
        },
        401: {
            type: "object",
            properties: {
                statusCode: { type: "number" },
                error: { type: "string" },
                message: { type: "string" },
            },
        },
    },
};
