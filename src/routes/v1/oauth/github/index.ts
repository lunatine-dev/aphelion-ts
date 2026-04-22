import { FastifyPluginAsync } from "fastify";
import { handleCallback } from "./handler";
import { callbackSchema } from "./schema";

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get("/callback", { schema: callbackSchema }, handleCallback);
};

export default routes;
