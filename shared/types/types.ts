import { z } from 'zod'
import { characterSchema, newCharacterSchema, playerSchema } from '../schemas/characters.schemas'
import {
    droptimizerSchema,
    newDroptimizerSchema,
    raidbotsURLSchema
} from '../schemas/simulations.schemas'
import { bossSchema, itemSchema, wowClassSchema } from '../schemas/wow.schemas'

export type WowClass = z.infer<typeof wowClassSchema>

export type Player = z.infer<typeof playerSchema>

export type Droptimizer = z.infer<typeof droptimizerSchema>
export type NewDroptimizer = z.infer<typeof newDroptimizerSchema>

export type Character = z.infer<typeof characterSchema>
export type NewCharacter = z.infer<typeof newCharacterSchema>

export type Item = z.infer<typeof itemSchema>

export type Boss = z.infer<typeof bossSchema>

export type RaidbotsURL = z.infer<typeof raidbotsURLSchema>
