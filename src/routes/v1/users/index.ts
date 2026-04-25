import { FastifyPluginAsync } from "fastify";
import { localUserSchema } from "./schema";
import { isAuthenticated } from "@core/middleware/auth";
import { handleLocalUser } from "./handler";

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        "/@me",
        { onRequest: isAuthenticated, schema: localUserSchema },
        handleLocalUser,
    );
};

export default routes;
