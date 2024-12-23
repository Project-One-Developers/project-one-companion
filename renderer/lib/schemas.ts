import { z } from "zod";

export const wowClassSchema = z.enum([
    "Death Knight",
    "Demon Hunter",
    "Druid",
    "Evoker",
    "Hunter",
    "Mage",
    "Monk",
    "Paladin",
    "Priest",
    "Rogue",
    "Shaman",
    "Warlock",
    "Warrior",
]);

export const wowRolesSchema = z.enum(["Tank", "Healer", "DPS"]);

export const wowRaidDiffSchema = z.enum(["Normal", "Heroic", "Mythic"]);

export const droptimizerItemSchema = z.object({
    itemId: z.number(),
    dmg: z.number(),
});

export const simFightInfoSchema = z.object({
    fightStyle: z.string(),
    targets: z.number(),
    duration: z.number(),
});

export const droptimizerCsvSchema = z.object({
    difficulty: z.string(),
    dmg: z.string(),
    upgrades: z.array(droptimizerItemSchema),
    simFightInfo: simFightInfoSchema,
});

export const characterSchema = z.object({
    characterName: z.string(),
    class: wowClassSchema,
    role: wowRolesSchema,
    droptimizer: z.array(droptimizerCsvSchema),
});