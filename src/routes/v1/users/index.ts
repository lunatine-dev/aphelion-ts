import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { isAuthenticated } from "@core/middleware/auth";
import { User } from "@models/User";
import { Session } from "@models/Session";

type AuthenticatedRequest = FastifyRequest & {
    userDoc: User;
    sessionDoc: Session;
};

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        "/@me",
        { onRequest: isAuthenticated },
        async (request, reply) => {
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
    );
};

export default routes;
