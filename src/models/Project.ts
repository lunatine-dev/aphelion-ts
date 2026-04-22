import { Schema, model, InferSchemaType } from "mongoose";
import { createId } from "@utils/id-generator";
import { ID_PREFIXES } from "@constants/entities";
import { randomBytes } from "node:crypto";

const projectSchema = new Schema(
    {
        projectId: {
            type: String,
            required: true,
            unique: true,
            default: (): string => createId(ID_PREFIXES.PROJECT),
        },
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
        // value will always be encrypted before saving
        envVars: [
            {
                key: String,
                value: String,
            },
        ],
        customDomain: {
            hostname: { type: String, unique: true, sparse: true },
            isVerified: { type: Boolean, default: false },
            verificationToken: {
                type: String,
                default: () => randomBytes(32).toString("hex"),
            },
            status: {
                type: String,
                enum: ["pending", "active", "failed"],
                default: "pending",
            },
        },
        projectType: {
            type: String,
            enum: ["frontend", "api", "worker", "other"],
            required: true,
        },
        internalPort: {
            type: Number,
            required: true, // Will be inputted by user but it will suggest a port based on what it can see from the app
        },
    },
    { timestamps: true },
);

export type Project = InferSchemaType<typeof projectSchema>;
export const ProjectModel = model<Project>("Project", projectSchema);
