import { z } from 'zod'
import { itemSchema } from './items.schema'

export const bisListSchema = z.object({
    itemId: itemSchema.shape.id,
    specIds: z.array(z.coerce.number())
})
