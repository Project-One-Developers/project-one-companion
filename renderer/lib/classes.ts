import { wowClassSchema, wowRolesSchema } from "./schemas";
import { WowClass } from "./types";

export const CLASSES = wowClassSchema.options;

export const ROLES = wowRolesSchema.options;

export const classColors = new Map<WowClass, string>([
    ["Demon Hunter", "#a330c9"],
    ["Rogue", "#fff468"],
    ["Mage", "#3fc7eb"],
    ["Warrior", "#c69b6d"],
    ["Druid", "#ff7c0a"],
    ["Paladin", "#f48cba"],
    ["Death Knight", "#c41e3a"],
    ["Hunter", "#aad372"],
    ["Shaman", "#0070dd"],
    ["Warlock", "#8788ee"],
    ["Priest", "#ffffff"],
    ["Monk", "#00ff98"],
    ["Evoker", "#33937f"],
]);
