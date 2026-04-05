import { Schema, model, InferSchemaType } from "mongoose";

const installationSchema = new Schema(
    {
        installationId: { type: Number, required: true },
        accountName: { type: String, required: true },
    },
    { _id: false },
);

const userSchema = new Schema(
    {
        githubId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        username: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        installations: [installationSchema],
    },
    { timestamps: true },
);

export type UserType = InferSchemaType<typeof userSchema>;
export type InstallationType = UserType["installations"][number];
export const User = model("User", userSchema);
