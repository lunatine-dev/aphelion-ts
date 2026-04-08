import { FastifyPluginAsync } from "fastify";

import { getUser } from "@services/github";
import { User, UserModel } from "@models/User";
import { issueAccessToken } from "@services/accessTokenService";
import { issueRefreshToken } from "@services/sessionService";
import { saveTicket } from "@services/ticketManager";

const route: FastifyPluginAsync = async (fastify) => {
    fastify.get("/callback", async (request, reply) => {
        // Get access token from OAuth flow
        const { token } =
            await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
                request,
            );

        // Fetch GitHub user details
        const user = await getUser(token.access_token);

        if (!user) {
            return reply.unauthorized("GitHub user could not be verified");
        }

        // Check if user is authorized to register
        const rawAllowedIds = process.env.ALLOWED_GITHUB_IDS || "";
        const allowedIds = rawAllowedIds.split(",").map((id) => id.trim());
        const currentUserId = user.id.toString();

        if (!allowedIds.includes(currentUserId)) {
            request.log.warn(
                {
                    attemptedId: currentUserId,
                    username: user.username,
                    ip: request.ip,
                },
                "Unauthorized login attempt: User not in allowlist",
            );

            return reply.unauthorized("Access Denied");
        }

        // Update / create user in database
        const dbUser: User = await UserModel.findOneAndUpdate(
            {
                githubId: user.id.toString(),
            },
            {
                $set: {
                    login: user.login,
                    name: user.name ?? user.login,
                    email: user.email,
                    avatar: user.avatar_url,
                },
            },
            {
                upsert: true,
                new: true,
                setDefaultOnInsert: true,
            },
        );

        // Issue token pair
        const ip = request.ip;
        const userAgent = request.headers["user-agent"] ?? "Generic";

        const { rawToken, sessionId } = await issueRefreshToken(
            dbUser._id,
            ip,
            userAgent,
        );
        const access_token = issueAccessToken(dbUser, sessionId, fastify);

        // Generate Temp code
        const ticketName = crypto.randomUUID();
        saveTicket(ticketName, {
            access_token,
            refresh_token: rawToken,
        });

        // Redirect to origin server with code
        return reply.redirect(
            `${process.env.ORIGIN_SERVER}/api/callback?ticket=${ticketName}`,
        );
    });
};

export default route;
