import { z } from 'zod'
import { itemSchema } from './items.schema'

export const bossSchema = z.object({
    id: z.number(),
    name: z.string(),
    instanceName: z.string(),
    instanceType: z.string(),
    instanceId: z.number(),
    order: z.number(),
    raiderioRaidSlug: z.string().nullish(),
    raiderioEncounterSlug: z.string().nullish()
})

export const bossWithItemsSchema = bossSchema.extend({
    items: z.array(itemSchema)
})
