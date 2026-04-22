import { customAlphabet } from "nanoid";
import { IdPrefix } from "@constants/entities";

const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 12);

/**
 * Creates a prefixed, URL-friendly unique identifier.
 * @param prefix - A valid IdPrefix literal
 */
export const createId = (prefix: IdPrefix): string => {
    return `${prefix}_${nanoid()}`;
};
