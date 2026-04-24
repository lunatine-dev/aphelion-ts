import { FastifyRequest, FastifyReply } from "fastify";
import { TicketBodyType, CallbackQueryType } from "./schema";

import { AppError } from "@core/errors/errors";
import { processGitHubAuth } from "@services/auth/github";
import { issueAccessToken } from "@services/auth/accessTokenService";
import { consumeTicket, saveTicket } from "@services/auth/ticketManager";

export const handleCallback = async (
    request: FastifyRequest<{ Querystring: CallbackQueryType }>,
    reply: FastifyReply,
) => {
    // Grab accessToken from auth flow
    const { token } =
        await request.server.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            request,
        );
    // Send token to GitHub auth service
    try {
        const { dbUser, sessionId, refreshToken } = await processGitHubAuth(
            token.access_token,
            request.ip,
            request.headers["user-agent"] ?? "Generic",
            request.log,
        );

        // Generate JWT accessToken
        const accessToken = issueAccessToken(
            dbUser,
            sessionId,
            request.server.jwt,
        );

        // Generate ticket
        const ticketName = crypto.randomUUID();
        saveTicket(ticketName, {
            accessToken,
            refreshToken,
        });

        // Redirect to origin server with ticket
        return reply.redirect(
            `${process.env.ORIGIN_SERVER}/api/callback?ticket=${ticketName}`,
        );
    } catch (err) {
        if (err instanceof AppError) {
            return reply.code(err.statusCode).send({
                error: err.name,
                message: err.message,
            });
        }

        request.log.error(err);
        return reply.internalServerError("Something went wrong");
    }
};

export const handleTicket = async (
    request: FastifyRequest<{ Body: TicketBodyType }>,
    reply: FastifyReply,
) => {
    const { ticket } = request.body;

    const payload = consumeTicket(ticket);

    if (!payload) {
        return reply.unauthorized(
            "The ticket is invalid, expired, or has already been used.",
        );
    }
};
