import { FastifyPluginAsync } from "fastify";
import { handleCallback, handleTicket } from "./handler";
import { callbackSchema, ticketSchema } from "./schema";

const routes: FastifyPluginAsync = async (fastify) => {
    fastify.get("/callback", { schema: callbackSchema }, handleCallback);
    fastify.post("/ticket/consume", { schema: ticketSchema }, handleTicket);
};

export default routes;
