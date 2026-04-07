import oauth, { FastifyOAuth2Options } from "@fastify/oauth2";
import { FastifyInstance } from "fastify";

const requiredEnv = [
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GITHUB_CALLBACK_URL",
];

for (const env of requiredEnv) {
    if (!process.env[env]) {
        console.error(`[OAuth Plugin] Missing: ${env}`);
        process.exit(1);
    }
}

export const autoConfig = {
    name: "githubOAuth2",
    scope: ["user:read"],
    credentials: {
        client: {
            id: process.env.GITHUB_CLIENT_ID!,
            secret: process.env.GITHUB_CLIENT_SECRET!,
        },
        auth: oauth.GITHUB_CONFIGURATION,
    },
    startRedirectPath: "/v1/oauth/github",
    callbackUri: process.env.GITHUB_CALLBACK_URL!,
};

export default oauth;
