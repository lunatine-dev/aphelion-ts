import { FastifyReply, FastifyRequest } from "fastify";
import { getSessions } from "@services/auth/sessionService";
import { AuthenticatedRequest } from "@defs/Request";

export const localUserHandler = {
    getDevices: async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = (request as AuthenticatedRequest).userDoc._id;

        return await getSessions(userId);
    },
    getUser: async (request: FastifyRequest, reply: FastifyReply) => {
        const { githubId, login, name, avatar } = (
            request as AuthenticatedRequest
        ).userDoc;

        return {
            githubId,
            login,
            name,
            avatar,
        };
    },
};
