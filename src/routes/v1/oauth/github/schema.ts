import { FastifySchema } from "fastify";

export const callbackSchema: FastifySchema = {
    querystring: {
        type: "object",
        required: ["code"],
        properties: {
            code: { type: "string" },
            state: { type: "string" },
        },
    },
    response: {
        302: {
            type: "null",
            description: "Redirects to the origin server with a ticket",
        },
    },
};
