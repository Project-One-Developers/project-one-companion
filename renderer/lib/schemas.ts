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

// TODO: probably move in separate folders/files

export const droptimizerItemSchema = z.object({
    itemId: z.number(),
    dmg: z.number(),
});

export const simFightInfoSchema = z.object({
    fightstyle: z.string(),
    duration: z.number().min(1),
    nTargets: z.number().min(1),
});

export const droptimizerSchema = z.object({
    id: z.string(),
    url: z.string().url(),
    resultRaw: z.string(),
    date: z.number(),
    raidDifficulty: z.string(),
    fightInfo: simFightInfoSchema,
});

export const characterSchema = z.object({
    characterName: z.string(),
    class: wowClassSchema,
    role: wowRolesSchema,
    droptimizer: z.array(droptimizerSchema),
});

export const playerSchema = z.object({
    playerName: z.string(),
    characters: z.array(characterSchema),
});
