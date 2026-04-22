import { OAuth2Namespace } from "@fastify/oauth2";
import { Session } from "@models/Session";
import { User } from "@models/User";

declare module "fastify" {
    interface FastifyInstance {
        githubOAuth2: OAuth2Namespace;
    }
    interface FastifyRequest {
        userDoc?: User;
        sessionDoc?: Session;
    }
}
