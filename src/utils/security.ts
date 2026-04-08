const allowedSet = new Set(
    (process.env.ALLOWED_GITHUB_IDS || "")
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0),
);

export const isWhitelisted = (githubId: string | number): boolean => {
    return allowedSet.has(githubId.toString());
};
