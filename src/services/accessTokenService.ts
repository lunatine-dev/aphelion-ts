import { FastifyInstance } from "fastify";
import { User } from "@models/User";
import { Types } from "mongoose";

export const issueAccessToken = (
    user: User,
    sessionId: Types.ObjectId,
    fastify: FastifyInstance,
) => {
    return fastify.jwt.sign(
        {
            sub: user._id.toString(),
            sid: sessionId.toString(),
            name: user.name,
            login: user.login,
            avatar: user.avatar,
        },
        {
            expiresIn: "30m",
        },
    );
};
