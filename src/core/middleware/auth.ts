import { FastifyReply, FastifyRequest } from "fastify";

import { Session, SessionModel } from "@models/Session";
import { User, UserModel } from "@models/User";
import { isWhitelisted } from "@utils/security";

export const isAuthenticated = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    // Check JWT token
    try {
        await request.jwtVerify();
    } catch (e) {
        return reply.unauthorized("Unauthorized");
    }

    // Extract data from JWT
    const { sub: userId, sid: sessionId, githubId } = request.user as any;

    // Verify this user is even whitelisted (failsafe)
    if (!isWhitelisted(githubId)) {
        request.log.warn(
            { githubId },
            "Whitelisting check failed in middleware",
        );
        return reply.unauthorized("Access Denied: You are not whitelisted.");
    }

    // Validate session & fetch user
    const session = await SessionModel.findOne({
        _id: sessionId,
        userId: userId,
        isValid: true,
        expiresAt: { $gt: new Date() },
    }).populate("userId");

    if (!session || !session.userId)
        return reply.unauthorized("Session expired or user not found");

    // We now have access to the user, attach it to the request for use in subsequent routes
    request.userDoc = session.userId as User;
    request.sessionDoc = session as Session;
};
