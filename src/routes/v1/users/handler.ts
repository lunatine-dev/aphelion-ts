import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "@models/User";
import { Session } from "@models/Session";

type AuthenticatedRequest = FastifyRequest & {
    userDoc: User;
    sessionDoc: Session;
};

export const handleLocalUser = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const { githubId, login, name, avatar } = (request as AuthenticatedRequest)
        .userDoc;

    return {
        githubId,
        login,
        name,
        avatar,
    };
};
