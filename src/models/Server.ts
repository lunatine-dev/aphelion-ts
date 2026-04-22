import { Schema, model, InferSchemaType, CallbackError, Types } from "mongoose";
import { ID_PREFIXES } from "@constants/entities";
import { createId } from "@utils/id-generator";

const serverSchema = new Schema(
    {
        name: { type: String, required: true },
        ipAddress: { type: String, required: true },
        agentSecret: { type: String, required: true, select: false },
        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline",
        },
        serverId: {
            type: String,
            required: true,
            unique: true,
            default: () => createId(ID_PREFIXES.SERVER),
        },
        nodeId: {
            //used for dns
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        region: {
            type: String,
            required: true,
            lowercase: true,
        },
    },
    { timestamps: true },
);

serverSchema.pre("save", async function () {
    if (!this.nodeId) {
        const entropy = Math.random().toString(36).substring(2, 8);
        this.nodeId = `node-${this.region}-${entropy}`.toLowerCase();
    }
});

export type Server = InferSchemaType<typeof serverSchema> & {
    _id: Types.ObjectId;
};

export const ServerModel = model<Server>("Server", serverSchema);
