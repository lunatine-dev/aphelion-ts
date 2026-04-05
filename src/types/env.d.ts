declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URI: string;
        PORT?: number;
        NODE_ENV?: "development" | "production" | "test";
    }
}
