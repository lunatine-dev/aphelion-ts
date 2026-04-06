import fastifyAutoload from "@fastify/autoload";
import env from "@fastify/env";
import { isDirectory } from "@utils/filesystem";

import path from "path";
import {
    FastifyError,
    FastifyPluginAsync,
    FastifyRequest,
    FastifyReply,
} from "fastify";

const schema = {
    type: "object",
    required: ["MONGO_URI", "PORT"],
    properties: {
        RATE_LIMIT_MAX: {
            type: "number",
            default: 100,
        },
    },
};

const serviceApp: FastifyPluginAsync = async (fastify, opts) => {
    // Load environment variables and attach to fastify object
    await fastify.register(env, {
        confKey: "config",
        schema,
        data: process.env,
        dotenv: false, // We don't have environment files, they're injected at runtime
    });

    const pluginDirs = [
        path.join(__dirname, "plugins/external"), // Third party plugins (cors, helmet, etc.)
        path.join(__dirname, "plugins/app"), // Internal plugins (auth, etc.)
    ];
    for (const dir of pluginDirs) {
        if (await isDirectory(dir)) {
            // Always check if directory exists because autoload will throw if a directory is missing
            await fastify.register(fastifyAutoload, {
                dir,
                options: { ...opts },
            });
        }
    }

    // Load routes
    fastify.register(fastifyAutoload, {
        dir: path.join(__dirname, "routes"),
        autoHooks: true,
        routeParams: true,
        cascadeHooks: true,
        options: { ...opts },
    });

    fastify.setErrorHandler(
        (err: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
            fastify.log.error(
                {
                    err,
                    request: {
                        method: request.method,
                        url: request.url,
                        query: request.query,
                        params: request.params,
                    },
                },
                "Unhandled error occurred",
            );
            reply.code(err.statusCode ?? 500);
            let message = "Internal Server Error";

            if (err.statusCode && err.statusCode < 500) {
                message = err.message;
            }

            return { message };
        },
    );

    fastify.setNotFoundHandler(
        (request: FastifyRequest, reply: FastifyReply) => {
            request.log.warn(
                {
                    request: {
                        method: request.method,
                        url: request.url,
                        query: request.query,
                        params: request.params,
                    },
                },
                "Resource not found",
            );
            reply.code(404);
            return { message: "Not Found" };
        },
    );
};

export default serviceApp;
