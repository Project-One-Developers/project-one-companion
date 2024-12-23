import { CLASSES } from "../classes";
import { WowClass } from "../types";

export function getClassColor(className: WowClass) {
    const classColor = CLASSES.find((classItem) => classItem === className);
    if (classColor) {
        return "bg-" + classColor.replace(" ", "").toLowerCase();
    }
    return "bg-deathknight";
}
