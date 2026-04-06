import { Schema, model, InferSchemaType } from "mongoose";

const projectSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        serverId: {
            type: Schema.Types.ObjectId,
            ref: "Server",
            required: true,
        },
        githubRepoId: { type: Number, required: true },
        installationId: { type: Number, required: true },
        repositoryName: { type: String, required: true },
        branch: { type: String, default: "main" },
        envVars: [
            {
                key: String,
                value: String,
            },
        ],
    },
    { timestamps: true },
);

export type ProjectType = InferSchemaType<typeof projectSchema>;
export const Project = model("Project", projectSchema);
