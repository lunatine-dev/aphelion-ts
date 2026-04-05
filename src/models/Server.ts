import { Schema, model, InferSchemaType } from "mongoose";

const serverSchema = new Schema(
    {
        name: { type: String, required: true },
        ipAddress: { type: String, required: true },
        agentSecret: { type: String, required: true, select: false }, // 'select: false' hides it from normal queries for safety
        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline",
        },
    },
    { timestamps: true },
);

export type ServerType = InferSchemaType<typeof serverSchema>;
export const Server = model("Server", serverSchema);
