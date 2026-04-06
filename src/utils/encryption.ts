import crypto from "node:crypto";

export class EncryptionService {
    private readonly algorithm = "aes-256-gcm";
    private readonly key: Buffer;

    constructor(encryptionKey: string) {
        if (!encryptionKey || encryptionKey.length !== 64)
            throw new Error(
                "Encryption key must be a 64-character hex string (32-bytes)",
            );

        this.key = Buffer.from(encryptionKey, "hex");
    }

    encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            this.algorithm,
            Buffer.from(this.key),
            iv,
        );

        const encrypted = Buffer.concat([
            cipher.update(text, "utf8"),
            cipher.final(),
        ]);

        const tag = cipher.getAuthTag();

        return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
    }
    decrypt(hash: string): string {
        try {
            const [iv, tag, content] = hash.split(":");
            const decipher = crypto.createDecipheriv(
                this.algorithm,
                Buffer.from(this.key),
                Buffer.from(iv, "hex"),
            );
            decipher.setAuthTag(Buffer.from(tag, "hex"));

            const decrypted = Buffer.concat([
                decipher.update(Buffer.from(content, "hex")),
                decipher.final(),
            ]);
            return decrypted.toString("utf8");
        } catch (error) {
            throw new Error(
                "Failed to decrypt data. The key may be invalid or the data tampered with",
            );
        }
    }
}
