import { FastifyPluginAsync } from "fastify";
import { refreshSchema } from "./schema";
import { handleRefresh } from "./handler";

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.post("/refresh", { schema: refreshSchema }, handleRefresh);
};

export default routes;
