import { z } from 'zod'
import { characterSchema } from './characters.schemas'

export const raidSessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    raidDate: z.number(),
    roster: z.array(characterSchema)
})

export const newRaidSessionSchema = z.object({
    name: z.string().min(1, 'Session name is required'),
    raidDate: z.number(),
    roster: z.array(z.string()) // array of character ids
})

export const editRaidSessionSchema = newRaidSessionSchema.extend({
    id: raidSessionSchema.shape.id
})
