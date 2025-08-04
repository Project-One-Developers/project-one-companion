import { z } from 'zod'
import { gearItemSchema } from './items.schema'
import { charRaiderioSchema } from './raiderio.schemas'
import { droptimizerSchema } from './simulations.schemas'
import { wowClassNameSchema, wowRolesSchema } from './wow.schemas'
import { charWowAuditSchema } from './wowaudit.schemas'

export const playerSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1)
})

export const characterSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    realm: z.string().min(1),
    class: wowClassNameSchema,
    role: wowRolesSchema,
    main: z.boolean(),
    playerId: playerSchema.shape.id
})

export const characterWithPlayerSchema = characterSchema.extend({
    player: playerSchema
})

export const playerWithCharacterSchema = playerSchema.extend({
    characters: z.array(characterSchema)
})

export const newPlayerSchema = playerSchema.omit({
    id: true
})

export const editPlayerSchema = newPlayerSchema.extend({
    id: playerSchema.shape.id
})

export const playersListSchema = z.object({
    players: z.array(playerSchema)
})

export const newCharacterSchema = characterSchema.omit({
    id: true
})

export const editCharacterSchema = characterSchema.extend({
    id: characterSchema.shape.id
})

export const characterGameInfoSchema = z.object({
    droptimizer: droptimizerSchema.nullable(),
    wowaudit: charWowAuditSchema.nullable(),
    raiderio: charRaiderioSchema.nullable()
})

export const characterWithProgressionSchema = z.object({
    p1Character: characterSchema,
    raiderIo: charRaiderioSchema.nullable()
})

export const characterWithGears = characterSchema.extend({
    gears: gearItemSchema.array()
})
