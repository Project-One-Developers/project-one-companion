import { z } from 'zod'
import { characterSchema } from './characters.schemas'
import { itemSchema } from './items.schema'
import { raidSessionSchema } from './raid.schemas'
import { wowRaidDiffSchema } from './wow.schemas'

export const newLootSchema = z.object({
    itemId: itemSchema.shape.id,
    dropDate: z.number().optional(),
    raidDifficulty: wowRaidDiffSchema,
    itemString: z.string().optional(),
    bonusString: z.string().optional(), // Leech, Speed, etc
    socket: z.boolean().optional(),
    rclootId: z.string().optional(),
    tertiaryStat: z.boolean().optional()
})

export const lootSchema = newLootSchema.extend({
    id: z.string().uuid(),
    charsEligibility: z.string().array(),
    assignedCharacterId: characterSchema.shape.id.nullable(),
    raidSessionId: raidSessionSchema.shape.id
})

export const lootWithItemSchema = lootSchema.extend({
    item: itemSchema
})

export const newLootsFromManualInputSchema = z
    .object({
        raidSessionId: z.string().uuid(),
        loots: z.array(newLootSchema.omit({ rclootId: true })).min(1)
    })
    .strict()

export const newLootsFromRcSchema = z
    .object({
        raidSessionId: z.string().uuid(),
        csv: z
            .string()
            .min(1)
            .refine((csv) => csv.includes(','), { message: 'Invalid CSV format' })
    })
    .strict()
