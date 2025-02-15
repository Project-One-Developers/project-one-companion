import { z } from 'zod'
import { characterSchema } from './characters.schemas'
import { gearItemSchema, itemSchema } from './items.schema'
import { raidSessionSchema } from './raid.schemas'
import { wowRaidDiffSchema } from './wow.schemas'

export const newLootSchema = z.object({
    gearItem: gearItemSchema,
    dropDate: z.number(),
    raidDifficulty: wowRaidDiffSchema,
    itemString: z.string().optional(), // only in rc csv import
    rclootId: z.string().optional() // only in rc csv import
})

export const newLootManualSchema = z.object({
    itemId: itemSchema.shape.id,
    raidDifficulty: wowRaidDiffSchema,
    hasSocket: z.boolean(),
    hasAvoidance: z.boolean(),
    hasLeech: z.boolean(),
    hasSpeed: z.boolean()
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

export const lootWithItemAndAssignedSchema = lootSchema.extend({
    item: itemSchema,
    assignedCharacter: characterSchema.nullable()
})

export const newLootsFromManualInputSchema = z
    .object({
        raidSessionId: z.string().uuid(),
        loots: z.array(newLootManualSchema).min(1)
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
