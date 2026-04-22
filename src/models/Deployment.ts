import { Schema, model, InferSchemaType } from "mongoose";

import { ID_PREFIXES } from "@constants/entities";
import { createId } from "@utils/id-generator";

const deploymentSchema = new Schema(
    {
        deploymentId: {
            type: String,
            required: true,
            unique: true,
            default: (): string => createId(ID_PREFIXES.DEPLOYMENT),
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        serverId: {
            type: Schema.Types.ObjectId,
            ref: "Server",
            required: true,
        },
        port: { type: Number, required: true },
        commitHash: {
            sha: { type: String, required: true },
            branch: { type: String, required: true },
            message: String,
            author: String,
            avatarUrl: String,
        },
        status: {
            type: String,
            enum: ["Queued", "Building", "Ready", "Error"],
            default: "Queued",
        },
        lifecycle: {
            type: String,
            enum: ["Active", "Superseded", "Dormant", "Failed"],
            default: "Active",
        },
        environment: {
            type: String,
            enum: ["Production", "Preview", "Development"],
            default: "Production",
        },

        logs: [{ type: String }],
        startedAt: { type: Date, default: Date.now },
        finishedAt: { type: Date },
    },
    { timestamps: true },
);

deploymentSchema.virtual("duration").get(function () {
    if (!this.startedAt || !this.finishedAt) return null;

    return this.finishedAt.getTime() - this.startedAt.getTime();
});
deploymentSchema.set("toJSON", { virtuals: true });
deploymentSchema.set("toObject", { virtuals: true });
deploymentSchema.index({ projectId: 1, createdAt: -1 });

export type Deployment = InferSchemaType<typeof deploymentSchema> & {
    duration?: number | null;
};
export const DeploymentModel = model<Deployment>(
    "Deployment",
    deploymentSchema,
);
