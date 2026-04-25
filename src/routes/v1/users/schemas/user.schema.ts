import { Type, Static } from "typebox";
import { FastifySchema } from "fastify";

export const UserResponse = Type.Object(
    {
        githubId: Type.String(),
        login: Type.String(),
        name: Type.Union([Type.String(), Type.Null()]),
        avatar: Type.String({ format: "uri" }),
    },
    { additionalProperties: false, $id: "User" },
);
export const ErrorResponse = Type.Object({
    statusCode: Type.Number(),
    error: Type.String(),
    message: Type.String(),
});
export const localUserSchema: FastifySchema = {
    response: {
        200: UserResponse,
        401: ErrorResponse,
    },
};
export type UserResponseType = Static<typeof UserResponse>;
