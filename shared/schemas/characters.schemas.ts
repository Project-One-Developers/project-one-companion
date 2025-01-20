import { z } from 'zod'
import { droptimizerSchema } from './simulations.schemas'
import { wowClassSchema, wowRolesSchema } from './wow.schemas'

export const playerSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1)
})

export const characterSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    realm: z.string().min(1),
    class: wowClassSchema,
    role: wowRolesSchema,
    main: z.boolean(),
    player: playerSchema,
    droptimizer: z.array(droptimizerSchema).optional()
})

export const playerWithCharacterSchema = playerSchema.extend({
    characters: z.array(
        characterSchema.omit({
            player: true
        })
    )
})

export const newPlayerSchema = playerSchema.omit({
    id: true
})

export const editPlayerSchema = newPlayerSchema.extend({
    id: playerSchema.shape.id
})

export const charactersListSchema = z.array(characterSchema)

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

export const editCharacterSchema = characterSchema.extend({
    id: characterSchema.shape.id
})
