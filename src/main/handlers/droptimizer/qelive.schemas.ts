import { z } from 'zod'

export type QELiveJson = z.infer<typeof qeliveJsonSchema>

export const qeliveEquippedItemSchema = z.object({
    id: z.number(),
    slot: z.string(),
    name: z.string().optional(),
    level: z.number(),
    upgradeTrack: z.string(),
    upgradeRank: z.number(),
    isEquipped: z.boolean(),
    vaultItem: z.boolean(),
    isCatalystItem: z.boolean(),
    softScore: z.number(),
    bonusIDS: z.string(), // column separated string of bonus IDs
    gemString: z.string() // column separated string of bonus IDs
})

export const qeliveResultSchema = z.object({
    item: z.number(),
    dropLoc: z.string(),
    dropDifficulty: z.preprocess(val => {
        if (val === '' || val === null || val === undefined) {
            return 0
        }
        return val
    }, z.number()), // 6 = HC, 7 = Mythic
    level: z.number(),
    score: z.number(),
    rawDiff: z.number(),
    percDiff: z.number()
})

export const qeliveJsonSchema = z.object({
    id: z.string(),
    dateCreated: z.string(),
    playername: z.string(),
    realm: z.string(),
    region: z.string(),
    autoGem: z.boolean(),
    spec: z.string(),
    contentType: z.string(),
    ufSettings: z.object({
        raid: z.array(z.number()),
        dungeon: z.number(),
        pvp: z.number(),
        craftedLevel: z.number(),
        craftedStats: z.string()
    }),
    equippedItems: z.array(qeliveEquippedItemSchema),
    results: z.array(qeliveResultSchema),
    gameType: z.string()
})
