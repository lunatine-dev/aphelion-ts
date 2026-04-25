import { Type, Static } from "typebox";
import { FastifySchema } from "fastify";

export const RefreshBody = Type.Object({
    refreshToken: Type.String(),
});
export type RefreshBodyType = Static<typeof RefreshBody>;
export const refreshSchema: FastifySchema = {
    body: RefreshBody,
    response: {
        200: Type.Object({
            accessToken: Type.String(),
            refreshToken: Type.String(),
        }),
        401: Type.Object({
            statusCode: Type.Literal(401),
            error: Type.String(),
            message: Type.String(),
        }),
    },
};
