import { FastifyPluginAsync } from "fastify";
import { handleCallback } from "./handler";

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get("/callback", handleCallback);
};

export default routes;
