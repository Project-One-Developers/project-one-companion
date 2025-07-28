import { z } from 'zod'
import {
    wowArmorTypeSchema,
    wowItemEquippedSlotKeySchema,
    wowItemSlotKeySchema,
    wowItemSlotSchema,
    wowItemTrackNameSchema
} from './wow.schemas'

export const itemSchema = z.object({
    id: z.number(),
    name: z.string(),
    ilvlBase: z.number(),
    ilvlMythic: z.number(),
    ilvlHeroic: z.number(),
    ilvlNormal: z.number(),
    itemClass: z.string(),
    slot: wowItemSlotSchema,
    slotKey: wowItemSlotKeySchema,
    itemSubclass: z.string().nullable(),
    armorType: wowArmorTypeSchema.nullable(),
    tiersetPrefix: z.string().nullable(),
    tierset: z.boolean(),
    token: z.boolean(),
    tokenPrefix: z.string().nullable(),
    veryRare: z.boolean().default(false),
    catalyzed: z.boolean().default(false),
    boe: z.boolean().default(false),
    specs: z.string().array().nullable(),
    specIds: z.number().array().nullable(),
    classes: z.string().array().nullable(),
    classesId: z.number().array().nullable(),
    stats: z.string().nullable(),
    mainStats: z.string().nullable(),
    secondaryStats: z.string().nullable(),
    wowheadUrl: z.string().url(),
    iconName: z.string(),
    iconUrl: z.string().url(),
    bossName: z.string(),
    bossId: z.number(),
    sourceId: z.number(), // instance id (eg: raid id, profession id, mplus name)
    sourceName: z.string(),
    sourceType: z.string(),
    onUseTrinket: z.boolean(),
    season: z.number()
})

export const itemToTiersetSchema = z.object({
    itemId: z.number(),
    tokenId: z.number(),
    classId: z.number()
})
export const itemToTiersetArraySchema = z.array(itemToTiersetSchema)

export const itemToCatalystSchema = z.object({
    itemId: z.number(),
    encounterId: z.number(),
    catalyzedItemId: z.number()
})
export const itemToCatalystArraySchema = z.array(itemToCatalystSchema)

export const itemTrackSchema = z.object({
    name: wowItemTrackNameSchema,
    fullName: z.string(),
    level: z.number(),
    max: z.number(),
    itemLevel: z.number(),
    season: z.number(),
    maxItemLevel: z.number()
})

/**
 * Represents a looted version of an item (so with bonus and actual ilvl)
 */
export const gearItemSchema = z.object({
    item: z.object({
        id: itemSchema.shape.id,
        name: itemSchema.shape.name,
        armorType: itemSchema.shape.armorType,
        slotKey: itemSchema.shape.slotKey,
        token: itemSchema.shape.token,
        tierset: itemSchema.shape.tierset,
        boe: itemSchema.shape.boe,
        veryRare: itemSchema.shape.veryRare,
        iconName: itemSchema.shape.iconName,
        season: itemSchema.shape.season,
        specIds: itemSchema.shape.specIds
    }),
    source: z.enum(['equipped', 'bag', 'great-vault', 'loot']),
    equippedInSlot: wowItemEquippedSlotKeySchema.optional(),
    itemLevel: z.number(),
    itemTrack: itemTrackSchema.nullable(),
    bonusIds: z.array(z.number()).nullable(),
    enchantIds: z.array(z.number()).nullable(),
    gemIds: z.array(z.number()).nullable(),
    craftedStats: z.string().optional(),
    craftingQuality: z.string().optional()
})
