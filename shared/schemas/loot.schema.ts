import { z } from 'zod'
import { itemSchema } from './items.schema'
import { wowRaidDiffSchema } from './wow.schemas'

export const newLootsFromRcSchema = z.object({
    raidSessionId: z.string(),
    csv: z.string()
})

export const lootInfoSchema = z.object({
    id: itemSchema.shape.id,
    diff: wowRaidDiffSchema,
    bonus: z.string().nullish(), // Leech, Speed, etc
    socket: z.boolean()
})

export const newLootsFromManualInputSchema = z.object({
    raidSessionId: z.string(),
    loots: z.array(lootInfoSchema)
})
