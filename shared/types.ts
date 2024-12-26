import { z } from 'zod'
import {
    bossSchema,
    characterSchema,
    droptimizerSchema,
    itemSchema,
    newCharacterSchema,
    newDroptimizerSchema,
    playerSchema,
    raidbotsURLSchema,
    wowClassSchema
} from './schemas'

export type WowClass = z.infer<typeof wowClassSchema>

export type Player = z.infer<typeof playerSchema>

export type Droptimizer = z.infer<typeof droptimizerSchema>
export type NewDroptimizer = z.infer<typeof newDroptimizerSchema>

export type Character = z.infer<typeof characterSchema>
export type NewCharacter = z.infer<typeof newCharacterSchema>

export type Item = z.infer<typeof itemSchema>

export type Boss = z.infer<typeof bossSchema>

export type RaidbotsURL = z.infer<typeof raidbotsURLSchema>
