import { z } from 'zod'
import { itemSchema } from './items.schema'
import { raidSessionSchema } from './raid.schemas'
import { wowRaidDiffSchema } from './wow.schemas'

export const lootSchema = z.object({
    id: z.string().uuid(),
    raidDifficulty: wowRaidDiffSchema,
    dropDate: z.number(),
    bonusString: z.string(),
    thirdStat: z.string(),
    socket: z.boolean(),
    raidSessionId: raidSessionSchema.shape.id,
    itemId: itemSchema.shape.id
})

export const lootWithItemSchema = lootSchema.extend({
    item: itemSchema
})

export const newLootSchema = z.object({
    itemId: itemSchema.shape.id,
    dropDate: z.number().nullish(),
    raidDifficulty: wowRaidDiffSchema,
    itemString: z.string().nullish(),
    bonusString: z.string().nullish(), // Leech, Speed, etc
    socket: z.boolean(),
    rclootId: z.string().nullish()
})

export const newLootsFromManualInputSchema = z.object({
    raidSessionId: z.string(),
    loots: z.array(newLootSchema)
})

export const newLootsFromRcSchema = z.object({
    raidSessionId: z.string(),
    csv: z.string()
})
