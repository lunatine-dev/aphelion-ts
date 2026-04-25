import { FastifyInstance } from "fastify";
import { User } from "@models/User";
import { Types } from "mongoose";

export const issueAccessToken = (
    user: User,
    sessionId: Types.ObjectId,
    jwt: Pick<FastifyInstance, "jwt">["jwt"],
) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            sid: sessionId.toString(),
            name: user.name,
            login: user.login,
            avatar: user.avatar,
            githubId: user.githubId,
            role: user.role,
        },
        {
            expiresIn: "30m",
        },
    );
};
