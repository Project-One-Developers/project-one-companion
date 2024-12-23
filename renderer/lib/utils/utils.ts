import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isPresent = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined;

export const newUUID = () => uuid();
