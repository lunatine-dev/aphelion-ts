import { Schema, model, InferSchemaType } from "mongoose";

const deploymentSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        commitHash: { type: String, required: true },
        status: {
            type: String,
            enum: ["queued", "building", "success", "failed"],
            default: "queued",
        },
        logs: { type: String },
        deployedAt: { type: Date },
    },
    { timestamps: true },
);

export type Deployment = InferSchemaType<typeof deploymentSchema>;
export const DeploymentModel = model<Deployment>(
    "Deployment",
    deploymentSchema,
);
