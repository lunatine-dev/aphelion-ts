export type AppConfig = {
    MONGO_URI: string;
    PORT: number;
    RATE_LIMIT_MAX: number;
};

declare module "fastify" {
    interface FastifyInstance {
        config: AppConfig;
    }
}
