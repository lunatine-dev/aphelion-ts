import crypto from "node:crypto";
import { SessionModel } from "@models/Session";
import { SESSION_EXPIRY_IN_DAYS } from "@constants/security";
import { Types } from "mongoose";

const hashToken = (raw: string) =>
    crypto.createHash("sha256").update(raw).digest("hex");

export const issueRefreshToken = async (
    userId: Types.ObjectId,
    ip: string,
    userAgent: string,
) => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);

    const expiresAt = new Date(
        Date.now() + SESSION_EXPIRY_IN_DAYS * 24 * 60 * 60 * 1000,
    );

    const session = await SessionModel.create({
        userId,
        refreshToken: hashedToken,
        ipAddress: ip,
        userAgent,
        expiresAt,
    });

    return { rawToken, sessionId: session._id };
};

export const rotateSession = async (
    rawOldToken: string,
    ip: string,
    userAgent: string,
) => {
    const hashedOldToken = hashToken(rawOldToken);

    const newExpiresAt = new Date(
        Date.now() + SESSION_EXPIRY_IN_DAYS * 24 * 60 * 60 * 1000,
    );
    const newRaw = crypto.randomBytes(32).toString("hex");
    const session = await SessionModel.findOneAndUpdate(
        {
            refreshToken: hashedOldToken,
            isValid: true,
            expiresAt: { $gt: new Date() },
        },
        {
            refreshToken: hashToken(newRaw),
            expiresAt: newExpiresAt,
            ipAddress: ip,
            userAgent,
        },
        { new: true }, // Returns the updated document
    );

    if (!session) return { error: "Invalid or expired session" };

    return {
        newRefreshToken: newRaw,
        sessionId: session._id,
    };
};
