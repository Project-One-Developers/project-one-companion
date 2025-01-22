import { z } from 'zod'
import { itemSchema } from './items.schema'

export const bossSchema = z.object({
    id: z.number(),
    name: z.string(),
    raidName: z.string().nullish(),
    raidId: z.number().nullish(),
    order: z.number()
})

export const bossWithItemsSchema = bossSchema.extend({
    items: z.array(itemSchema)
})
