import { Schema, model, InferSchemaType, Types, Document } from "mongoose";
import type { User } from "./User";

const sessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true,
            select: false,
        },
        userAgent: { type: String },
        ipAddress: { type: String },
        isValid: { type: Boolean, default: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true },
);

// Auto-cleanup expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

type InferredSession = InferSchemaType<typeof sessionSchema>;

export interface Session extends Omit<InferredSession, "userId"> {
    userId: Types.ObjectId | User;
    createdAt: Date;
    updatedAt: Date;
}

export const SessionModel = model<Session>("Session", sessionSchema);
