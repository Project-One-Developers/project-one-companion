import { z } from 'zod'
import { gearItemSchema } from './items.schema'

export const encounterSchema = z.object({
    slug: z.string(),
    itemLevel: z.number(),
    artifactTraits: z.number(),
    numKills: z.number(),
    firstDefeated: z.string().nullable(), // ISO date string
    lastDefeated: z.string().nullable(), // ISO date string
    bossIcon: z.string()
})

export const encountersDefeatedSchema = z.object({
    normal: z.array(encounterSchema).optional(),
    heroic: z.array(encounterSchema).optional(),
    mythic: z.array(encounterSchema).optional()
})

export const raidProgressSchema = z.object({
    raid: z.string(),
    encountersDefeated: encountersDefeatedSchema
})

export const raiderIoProgressSchema = z.object({
    tier: z.string(),
    raidProgress: z.array(raidProgressSchema)
})

export const charRaiderioSchema = z.object({
    name: z.string().max(24),
    realm: z.string(),
    race: z.string().nullable(),
    characterId: z.number(),
    p1SyncAt: z.number(), // 2025-07-29T06:00:12.000Z
    loggedOutAt: z.number(), // 2025-07-29T06:00:12.000Z
    itemUpdateAt: z.number(), // 2025-07-29T06:00:12.000Z
    averageItemLevel: z.string(),
    itemsEquipped: z.array(gearItemSchema),
    progress: raiderIoProgressSchema
})

// Types
export type CharacterRaiderio = z.infer<typeof charRaiderioSchema>
export type RaiderioProgress = z.infer<typeof raiderIoProgressSchema>
export type RaiderioEncounter = z.infer<typeof encounterSchema>
// export type RaiderioEncountersDefeated = z.infer<typeof encountersDefeatedSchema>
// export type RaiderioRaidProgress = z.infer<typeof raidProgressSchema>

// export type CharacterBossProgressionResponse = z.infer<typeof characterBossProgressionSchema>

// // New types for character details
// export type RaiderioGemDetail = z.infer<typeof gemDetailSchema>
// export type RaiderioEnchantDetail = z.infer<typeof enchantDetailSchema>
// export type RaiderioItem = z.infer<typeof itemSchema>

// export type RaiderioItemDetails = z.infer<typeof itemDetailsSchema>
// export type RaiderioCharacterDetails = z.infer<typeof characterDetailsSchema>
