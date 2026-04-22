import { Schema, model, InferSchemaType, Types } from "mongoose";
import { User } from "./User";

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
        },
        userAgent: { type: String },
        ipAddress: { type: String },
        isValid: { type: Boolean, default: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true },
);

type InferredSession = InferSchemaType<typeof sessionSchema>;

export interface Session extends Omit<InferredSession, "userId"> {
    userId: Types.ObjectId | User;
}

export const SessionModel = model<Session>("Session", sessionSchema);
