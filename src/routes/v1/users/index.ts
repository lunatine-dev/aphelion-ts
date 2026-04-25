import { FastifyPluginAsync } from "fastify";
import { localUserSchema, getDevicesSchema } from "./schema";
import { isAuthenticated } from "@core/middleware/auth";
import { localUserHandler } from "./handler";

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        "/@me",
        { onRequest: isAuthenticated, schema: localUserSchema },
        localUserHandler.getUser,
    );
    fastify.get(
        "/@me/devices",
        {
            onRequest: isAuthenticated,
            schema: getDevicesSchema,
        },
        localUserHandler.getDevices,
    );
};

export default routes;
