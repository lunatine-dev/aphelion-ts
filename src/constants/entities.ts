export const ID_PREFIXES = {
    DEPLOYMENT: "dep",
    PROJECT: "prj",
    DOMAIN: "dom",
    SERVER: "node",
} as const;

export type IdPrefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES];
