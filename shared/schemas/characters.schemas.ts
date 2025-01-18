import { z } from 'zod'
import { droptimizerSchema } from './simulations.schemas'
import { wowClassSchema, wowRolesSchema } from './wow.schemas'

export const characterSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    realm: z.string().min(1),
    class: wowClassSchema,
    role: wowRolesSchema,
    main: z.boolean(),
    droptimizer: z.array(droptimizerSchema).optional()
})

export const playerSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    characters: z.array(characterSchema).optional()
})

export const newPlayerSchema = playerSchema.omit({
    id: true,
    characters: true
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
    .extend({
        playerName: characterSchema.shape.name
    })
