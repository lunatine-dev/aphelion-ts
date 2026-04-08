import { getUser } from "@services/github";
import { issueRefreshToken } from "@services/auth/sessionService";

import { User, UserModel } from "@models/User";
import { AppError } from "@core/errors";
import { FastifyBaseLogger } from "fastify";

export const processGitHubAuth = async (
    accessToken: string,
    ip: string,
    ua: string,
    logger: FastifyBaseLogger,
) => {
    // Fetch GitHub user details
    const user = await getUser(accessToken);
    if (!user) throw new AppError("User not found", 401);

    // Check if user is authorized to register
    const rawAllowedIds = process.env.ALLOWED_GITHUB_IDS || "";
    const allowedIds = rawAllowedIds.split(",").map((id) => id.trim());
    const currentUserId = user.id.toString();

    if (!allowedIds.includes(currentUserId)) {
        logger.warn(
            {
                attemptedId: currentUserId,
                username: user.username,
                ip: ip,
            },
            "Unauthorized login attempt: User not in allowlist",
        );

        throw new AppError("Access Denied", 401);
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

    // Issue session
    const { rawToken, sessionId } = await issueRefreshToken(dbUser._id, ip, ua);

    return {
        dbUser,
        sessionId,
        refreshToken: rawToken,
    };
};
