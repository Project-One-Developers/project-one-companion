import { z } from 'zod'
import {
    characterSchema,
    droptimizerSchema,
    newCharacterSchema,
    newDroptimizerSchema,
    playerSchema,
    wowClassSchema
} from './schemas'

export type WowClass = z.infer<typeof wowClassSchema>

export type Player = z.infer<typeof playerSchema>

export type Droptimizer = z.infer<typeof droptimizerSchema>
export type NewDroptimizer = z.infer<typeof newDroptimizerSchema>

export type Character = z.infer<typeof characterSchema>
export type NewCharacter = z.infer<typeof newCharacterSchema>
