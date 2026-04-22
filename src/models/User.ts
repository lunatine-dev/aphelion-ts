import { Schema, model, InferSchemaType, Types } from "mongoose";

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
        login: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        installations: [installationSchema],
    },
    { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema> & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};
export type InstallationType = User["installations"][number];
export const UserModel = model<User>("User", userSchema);
