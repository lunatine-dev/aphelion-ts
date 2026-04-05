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

export type DeploymentType = InferSchemaType<typeof deploymentSchema>;
export const Deployment = model("Deployment", deploymentSchema);
