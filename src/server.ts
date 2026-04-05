import Fastify from "fastify";
import fp from "fastify-plugin";
import closeWithGrace from "close-with-grace";

import mongoose from "mongoose";

import serviceApp from "./app";

const app = Fastify({
    logger:
        process.env.NODE_ENV === "production"
            ? true
            : {
                  transport: {
                      target: "pino-pretty",
                      options: {
                          translateTime: "HH:MM:ss Z",
                          ignore: "pid,hostname",
                      },
                  },
              },
    trustProxy: process.env.NODE_ENV === "production",
});

let connected = false;

const init = async () => {
    app.register(fp(serviceApp));

    closeWithGrace(
        {
            delay: 1000,
        },
        async ({ err }) => {
            if (err != null) app.log.error(err);
            if (connected) await mongoose.disconnect();
            await app.close();
        },
    );

    await app.ready();
    app.log.info("Plugins loaded");

    try {
        await mongoose.connect(process.env.MONGO_URI);
        connected = true;
        app.log.info("Connected to MongoDB");

        app.listen(
            {
                host: "0.0.0.0",
                port: process.env.PORT ?? 3000,
            },
            (err, address) => {
                app.log.info("App listening at " + address);
            },
        );
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

init();
