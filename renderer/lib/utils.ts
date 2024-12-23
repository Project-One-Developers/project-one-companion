import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CLASSES } from "./classes";
import { WowClass } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getClassColor(className: WowClass) {
    const classColor = CLASSES.find((classItem) => classItem === className);
    if (classColor) {
        return "bg-" + classColor.replace(" ", "").toLowerCase();
    }
    return "bg-deathknight";
}
