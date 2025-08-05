import { z } from 'zod'
import { characterSchema } from './characters.schemas'
import { gearItemSchema, itemSchema } from './items.schema'
import { raidSessionWithRosterSchema } from './raid.schemas'
import { tierSetBonusSchema, wowRaidDiffSchema } from './wow.schemas'

export const newLootSchema = z.object({
    gearItem: gearItemSchema,
    dropDate: z.number(),
    raidDifficulty: wowRaidDiffSchema,
    itemString: z.string().nullable(), // only in rc csv import
    addonId: z.string().nullable() // only in rc csv/mrt import
})

export const newLootManualSchema = z.object({
    itemId: itemSchema.shape.id,
    raidDifficulty: wowRaidDiffSchema,
    hasSocket: z.boolean(),
    hasAvoidance: z.boolean(),
    hasLeech: z.boolean(),
    hasSpeed: z.boolean()
})

export const lootSchema = z.object({
    id: z.string(),
    raidSessionId: raidSessionWithRosterSchema.shape.id,
    itemId: itemSchema.shape.id,
    gearItem: gearItemSchema,
    dropDate: z.number(),
    raidDifficulty: wowRaidDiffSchema,
    itemString: z.string().nullable(), // only in rc/mrt csv import
    charsEligibility: z.string().array(),
    assignedCharacterId: characterSchema.shape.id.nullable(),
    tradedToAssigned: z.boolean()
})

export const lootWithItemSchema = lootSchema.extend({
    item: itemSchema
})

export const charAssignmentHighlightsSchema = z.object({
    isMain: z.boolean(),
    dpsGain: z.number(),
    lootEnableTiersetBonus: tierSetBonusSchema,
    ilvlDiff: z.number(),
    gearIsBis: z.boolean(),
    alreadyGotIt: z.boolean(),
    score: z.number(),
    isTrackUpgrade: z.boolean()
})

export const lootWithAssignedSchema = lootSchema.extend({
    assignedCharacter: characterSchema.nullable(),
    assignedHighlights: charAssignmentHighlightsSchema.nullable()
})

export const newLootsFromManualInputSchema = z
    .object({
        raidSessionId: z.uuid(),
        loots: z.array(newLootManualSchema).min(1)
    })
    .strict()

export const newLootsFromRcSchema = z
    .object({
        raidSessionId: z.uuid(),
        csv: z
            .string()
            .min(1)
            .refine(csv => csv.includes(','), { message: 'Invalid CSV format' })
    })
    .strict()
