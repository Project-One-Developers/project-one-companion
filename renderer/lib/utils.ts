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

// These timestamps are in seconds, not milliseconds
export const getUnixTimestamp = () => Math.floor(Date.now() / 1000);
export const isoToUnixTimestamp = (isoDateTime: string) =>
  Math.floor(new Date(isoDateTime).getTime() / 1000);
