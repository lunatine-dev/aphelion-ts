import { Type, Static } from "typebox";
import { FastifySchema } from "fastify";

export const DeviceResponse = Type.Object(
    {
        _id: Type.String(),
        ipAddress: Type.String({
            examples: ["127.0.0.1"],
            default: "Unknown",
        }),
        userAgent: Type.String({
            examples: ["Mozilla/5.0..."],
            default: "Unknown Device",
        }),
        isValid: Type.Boolean(),
        expiresAt: Type.String({ format: "date-time" }),
        createdAt: Type.String({ format: "date-time" }),
        updatedAt: Type.String({ format: "date-time" }),
    },
    { additionalProperties: false, $id: "Device" },
);

export const getDevicesSchema: FastifySchema = {
    response: {
        200: Type.Array(DeviceResponse),
        401: Type.Object({
            statusCode: Type.Number(),
            error: Type.String(),
            message: Type.String(),
        }),
    },
};

export type DeviceResponseType = Static<typeof DeviceResponse>;
