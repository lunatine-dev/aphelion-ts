import { FastifyPluginAsync } from "fastify";

interface PingResponse {
    message: string;
    timestamp: number;
    rnd: number;
}

const route: FastifyPluginAsync = async (fastify) => {
    fastify.get<{ Reply: PingResponse }>("/ping", async () => {
        return {
            message: "Pong!",
            timestamp: Date.now(),
            rnd: Math.random(),
        };
    });
};

export default route;
