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

// Character Details Schemas
const corruptionSchema = z.object({
    added: z.number(),
    resisted: z.number(),
    total: z.number(),
    cloakRank: z.number().optional(),
    spells: z.array(z.any()).optional()
})

const spellSchema = z.object({
    id: z.number(),
    school: z.number(),
    icon: z.string(),
    name: z.string(),
    rank: z.number().nullable()
})

const azeritePowerSchema = z
    .object({
        id: z.number(),
        spell: spellSchema,
        tier: z.number()
    })
    .nullable()

const gemDetailSchema = z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string()
})

const enchantDetailSchema = z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string()
})

const itemSchema = z.object({
    item_id: z.number(),
    item_level: z.number(),
    enchant: z.number().optional(),
    icon: z.string(),
    name: z.string(),
    item_quality: z.number(),
    is_legendary: z.boolean(),
    is_azerite_armor: z.boolean(),
    azerite_powers: z.array(azeritePowerSchema),
    corruption: corruptionSchema,
    domination_shards: z.array(z.any()),
    tier: z.string().optional(),
    gems: z.array(z.number()),
    gems_detail: z.array(gemDetailSchema),
    enchants: z.array(z.number()),
    enchants_detail: z.array(enchantDetailSchema),
    bonuses: z.array(z.number())
})

const itemsSchema = z.object({
    head: itemSchema.optional(),
    neck: itemSchema.optional(),
    shoulder: itemSchema.optional(),
    back: itemSchema.optional(),
    chest: itemSchema.optional(),
    waist: itemSchema.optional(),
    wrist: itemSchema.optional(),
    hands: itemSchema.optional(),
    legs: itemSchema.optional(),
    feet: itemSchema.optional(),
    finger1: itemSchema.optional(),
    finger2: itemSchema.optional(),
    trinket1: itemSchema.optional(),
    trinket2: itemSchema.optional(),
    mainhand: itemSchema.optional(),
    offhand: itemSchema.optional()
})

const itemDetailsSchema = z.object({
    created_at: z.string(), // ISO date string
    updated_at: z.string(), // ISO date string
    source: z.string(),
    item_level_equipped: z.number(),
    item_level_total: z.number(),
    artifact_traits: z.number(),
    corruption: corruptionSchema,
    items: itemsSchema
})

const loadoutSourceDetailsSchema = z.object({
    source: z.string()
})

const expansionDataSchema = z.object({
    expansionId: z.number()
})

const characterDetailsSchema = z.object({
    character: z.any().nullable(), // dont care
    team: z.any().nullable(),
    characterCustomizations: z.any().nullable(),
    patronLevel: z.string().nullable(),
    meta: z.any().nullable(), // dont care
    newsArticle: z.any().nullable(),
    user: z.any().nullable(),
    raidProgress: z.any(), // dont care
    itemDetails: itemDetailsSchema,
    loadoutSourceDetails: loadoutSourceDetailsSchema,
    tier: z.string(),
    isMissingPersonaFields: z.boolean(),
    isTournamentProfile: z.boolean(),
    expansionData: expansionDataSchema
})

export const raiderioCharacterResponseSchema = z.object({
    characterRaidProgress: characterRaidProgressSchema,
    characterMythicPlusProgress: z.any(), // We don't care about this info
    characterDetails: characterDetailsSchema
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

// New types for character details
export type RaiderioCorruption = z.infer<typeof corruptionSchema>
export type RaiderioSpell = z.infer<typeof spellSchema>
export type RaiderioAzeritePower = z.infer<typeof azeritePowerSchema>
export type RaiderioGemDetail = z.infer<typeof gemDetailSchema>
export type RaiderioEnchantDetail = z.infer<typeof enchantDetailSchema>
export type RaiderioItem = z.infer<typeof itemSchema>
export type RaiderioItems = z.infer<typeof itemsSchema>
export type RaiderioItemDetails = z.infer<typeof itemDetailsSchema>
export type RaiderioLoadoutSourceDetails = z.infer<typeof loadoutSourceDetailsSchema>
export type RaiderioExpansionData = z.infer<typeof expansionDataSchema>
export type RaiderioCharacterDetails = z.infer<typeof characterDetailsSchema>
