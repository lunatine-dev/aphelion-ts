import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { isAuthenticated } from "@core/middleware/auth";
import { User } from "@models/User";
import { Session } from "@models/Session";
import { localUserSchema } from "./schema";

/**
 * RATIONALE:
 * 1. UserResponse (Interface): Defines the API Contract. Used as a Generic to
 * provide IDE autocomplete and prevent typos during 'return'.
 * 2. AuthenticatedRequest (Type): Internal helper to cast the Request. Tells TS
 * that 'isAuthenticated' has successfully injected userDoc/sessionDoc.
 * 3. localUserSchema (Schema): Runtime security. Filters extra fields to prevent
 * leaks and optimizes JSON serialization speed.
 */

interface UserResponse {
    githubId: string;
    login: string;
    name: string | null;
    avatar: string;
}
type AuthenticatedRequest = FastifyRequest & {
    userDoc: User;
    sessionDoc: Session;
};

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get<{ Reply: UserResponse }>(
        "/@me",
        { onRequest: isAuthenticated, schema: localUserSchema },
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
