import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CLASSES } from "./classes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClassColor(className: string) {
  const classColor = CLASSES.find((classItem) => classItem === className);
  if (classColor) {
    return "bg-" + classColor.toLowerCase();
  }
  return "bg-deathknight";
}
