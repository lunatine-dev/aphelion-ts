// src/utils/filesystem.ts
import { promises as fs } from "fs";
import { constants } from "fs";
import path from "path";

/**
 * Check if a path exists (file or folder)
 */
export async function exists(targetPath: string): Promise<boolean> {
    try {
        await fs.access(targetPath, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if a path is a file
 */
export async function isFile(targetPath: string): Promise<boolean> {
    try {
        const stats = await fs.stat(targetPath);
        return stats.isFile();
    } catch {
        return false;
    }
}

/**
 * Check if a path is a directory
 */
export async function isDirectory(targetPath: string): Promise<boolean> {
    try {
        const stats = await fs.stat(targetPath);
        return stats.isDirectory();
    } catch {
        return false;
    }
}

/**
 * Safely create a directory if it doesn't exist
 */
export async function ensureDir(dirPath: string): Promise<void> {
    if (!(await exists(dirPath))) {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

/**
 * Read a file as string (UTF-8)
 */
export async function readFile(targetPath: string): Promise<string | null> {
    try {
        return await fs.readFile(targetPath, "utf-8");
    } catch {
        return null;
    }
}

/**
 * Write string content to a file
 */
export async function writeFile(
    targetPath: string,
    data: string,
): Promise<void> {
    await fs.writeFile(targetPath, data, "utf-8");
}

/**
 * Resolve a path relative to the project root
 */
export function resolvePath(...paths: string[]): string {
    return path.resolve(process.cwd(), ...paths);
}
