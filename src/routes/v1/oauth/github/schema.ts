import { Type, Static } from "typebox";
import { FastifySchema } from "fastify";

export const TicketBody = Type.Object({
    ticket: Type.String({
        format: "uuid",
    }),
});
export type TicketBodyType = Static<typeof TicketBody>;
export const ticketSchema: FastifySchema = {
    body: TicketBody,
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

export const CallbackQuery = Type.Object({
    code: Type.String(),
    state: Type.Optional(Type.String()),
});
export type CallbackQueryType = Static<typeof CallbackQuery>;
export const callbackSchema: FastifySchema = {
    querystring: CallbackQuery,
    response: {
        302: Type.Null(),
    },
};
