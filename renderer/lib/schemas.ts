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

export const newDroptimizerSchema = droptimizerSchema.omit({ id: true });

export const characterSchema = z.object({
    id: z.string().uuid(),
    characterName: z.string(),
    class: wowClassSchema,
    role: wowRolesSchema,
    droptimizer: z.array(droptimizerSchema).optional(),
});

export const playerSchema = z.object({
    id: z.string().uuid(),
    playerName: z.string(),
    characters: z.array(characterSchema).optional(),
});

export const newCharacterSchema = characterSchema
    .omit({
        id: true,
        droptimizer: true,
    })
    .merge(playerSchema.omit({ id: true, characters: true }));
