import { z } from 'zod'
import { wowClassSchema, wowSpecSchema } from './wow.schemas'

export const bisListSchema = z.object({
    wowClass: wowClassSchema,
    wowSpec: wowSpecSchema,
    itemIds: z.array(z.coerce.number())
})
