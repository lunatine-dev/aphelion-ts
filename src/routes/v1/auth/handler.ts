import { FastifyRequest, FastifyReply } from "fastify";
import mongoose from "mongoose";

import { RefreshBodyType } from "./schema";

import { rotateSession } from "@services/auth/sessionService";
import { SessionModel } from "@models/Session";
import { issueAccessToken } from "@services/auth/accessTokenService";

export const handleRefresh = async (
    request: FastifyRequest<{ Body: RefreshBodyType }>,
    reply: FastifyReply,
) => {
    const { refreshToken } = request.body;

    const realIp = (request.headers["x-forwarded-for"] as string) || request.ip;
    const realUserAgent = request.headers["user-agent"] ?? "Unknown";

    const result = await rotateSession(refreshToken, realIp, realUserAgent);

    if ("error" in result) {
        return reply.unauthorized(result.error);
    }

    const session = await SessionModel.findById(result.sessionId).populate(
        "userId",
    );
    if (!session || !session.userId) {
        return reply.unauthorized("User session no longer exists");
    }

    if (
        typeof session.userId === "string" ||
        session.userId instanceof mongoose.Types.ObjectId
    ) {
        return reply.internalServerError("User data failed to populate");
    }

    const accessToken = issueAccessToken(
        session.userId,
        result.sessionId,
        request.server.jwt,
    );

    return { accessToken, refreshToken: result.newRefreshToken };
};
