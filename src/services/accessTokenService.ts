import { FastifyInstance } from "fastify";
import { User } from "@models/User";

export const issueAccessToken = (
    user: User,
    sessionId: string,
    fastify: FastifyInstance,
) => {
    return fastify.jwt.sign(
        {
            sub: user._id,
            sid: sessionId,
            name: user.name,
            login: user.login,
            avatar: user.avatar,
        },
        {
            expiresIn: "30m",
        },
    );
};
