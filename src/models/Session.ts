import { Schema, model, InferSchemaType } from "mongoose";

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

export type SessionType = InferSchemaType<typeof sessionSchema>;
export const Session = model("Session", sessionSchema);
