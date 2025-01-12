import { z } from 'zod'
import { characterSchema } from './characters.schemas'
import { itemSchema } from './items.schema'

export const bossSchema = z.object({
    id: z.number(),
    name: z.string(),
    raidName: z.string().nullish(),
    raidId: z.number().nullish(),
    order: z.number(),
    items: z.array(itemSchema)
})

export const newBossSchema = bossSchema.omit({ items: true })

export const raidSessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    date: z.number(),
    roster: z.array(characterSchema.omit({ droptimizer: true }))
})

export const newRaidSessionSchema = z.object({
    name: z.string(),
    date: z.number(),
    roster: z.array(z.number()) // array of character ids
})
