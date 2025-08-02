import { z } from 'zod'

export const itemNoteSchema = z.object({
    itemId: z.number(),
    note: z.string()
})

