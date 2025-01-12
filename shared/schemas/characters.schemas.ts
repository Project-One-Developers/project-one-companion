import { z } from 'zod'
import { droptimizerSchema } from './simulations.schemas'
import { wowClassSchema, wowRolesSchema } from './wow.schemas'

export const characterSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    class: wowClassSchema,
    role: wowRolesSchema,
    droptimizer: z.array(droptimizerSchema).optional()
})

export const playerSchema = z.object({
    id: z.string().uuid(),
    playerName: z.string(),
    characters: z.array(characterSchema).optional()
})

export const charactersListSchema = z.object({
    characters: z.array(characterSchema)
})

export const playersListSchema = z.object({
    players: z.array(playerSchema)
})

export const newCharacterSchema = characterSchema
    .omit({
        id: true,
        droptimizer: true
    })
    .merge(playerSchema.omit({ id: true, characters: true }))
