import { FastifyRequest } from "fastify";
import { User } from "@models/User";
import { Session } from "@models/Session";

export type AuthenticatedRequest = FastifyRequest & {
    userDoc: User;
    sessionDoc: Session;
};
