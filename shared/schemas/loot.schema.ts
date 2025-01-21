import { z } from 'zod'
import { itemSchema } from './items.schema'
import { raidSessionSchema } from './raid.schemas'
import { wowRaidDiffSchema } from './wow.schemas'

export const lootSchema = z.object({
    id: z.string().uuid(),
    dropDate: z.number(),
    thirdStat: z.string().max(255),
    socket: z.boolean(),
    raidSessionId: raidSessionSchema.shape.id,
    itemId: itemSchema.shape.id
})

export const newLootSchema = z.object({
    itemId: itemSchema.shape.id,
    dropDate: z.number().nullish(),
    diff: wowRaidDiffSchema,
    bonus: z.string().nullish(), // Leech, Speed, etc
    socket: z.boolean()
})

export const newLootsFromManualInputSchema = z.object({
    raidSessionId: z.string(),
    loots: z.array(newLootSchema)
})

export const newLootsFromRcSchema = z.object({
    raidSessionId: z.string(),
    csv: z.string()
})
