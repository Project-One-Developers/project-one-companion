import { z } from 'zod'
import { characterSchema } from './characters.schemas'

const encounterSchema = z.object({
    slug: z.string(),
    firstDefeated: z.string().nullable(), // ISO date string
    itemLevel: z.number(),
    artifactTraits: z.number(),
    numKills: z.number(),
    lastDefeated: z.string().nullable(), // ISO date string
    bossIcon: z.string()
})

const raidTierSchema = z.object({
    name: z.string(),
    ordinal: z.number()
})

const encountersDefeatedSchema = z.object({
    normal: z.array(encounterSchema).optional(),
    heroic: z.array(encounterSchema).optional(),
    mythic: z.array(encounterSchema).optional()
})

const raidProgressSchema = z.object({
    raid: z.string(),
    aotc: z.string().nullable(), // ISO date string - Ahead of the Curve achievement
    cuttingEdge: z.string().nullable(), // ISO date string - Cutting Edge achievement
    encountersDefeated: encountersDefeatedSchema,
    progress: z.any().nullable(), // This field appears to be null in the example
    tier: raidTierSchema,
    raidWeekAotC: z.number().nullable(),
    raidWeekCuttingEdge: z.number().nullable()
})

const characterRaidProgressSchema = z.object({
    tier: z.string(),
    raidProgress: z.array(raidProgressSchema)
})

export const raiderioCharacterResponseSchema = z.object({
    characterRaidProgress: characterRaidProgressSchema,
    characterMythicPlusProgress: z.any(), // We don't care about this info
    characterDetails: z.any() // We don't care about this info
})

export const characterBossProgressionSchema = raiderioCharacterResponseSchema.extend({
    character: characterSchema
})

// Types
export type RaiderioEncounter = z.infer<typeof encounterSchema>
export type RaiderioRaidTier = z.infer<typeof raidTierSchema>
export type RaiderioEncountersDefeated = z.infer<typeof encountersDefeatedSchema>
export type RaiderioRaidProgress = z.infer<typeof raidProgressSchema>
export type RaiderioCharacterRaidProgress = z.infer<typeof characterRaidProgressSchema>
export type RaiderioCharacterResponse = z.infer<typeof raiderioCharacterResponseSchema>
export type CharacterBossProgressionResponse = z.infer<typeof characterBossProgressionSchema>
