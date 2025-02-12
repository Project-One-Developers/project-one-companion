import { z } from 'zod'
import {
    wowArmorTypeSchema,
    wowItemEquippedSlotKeySchema,
    wowItemSlotKeySchema,
    wowItemSlotSchema
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
    specIds: z.string().array().nullable(),
    classes: z.string().array().nullable(),
    classesId: z.string().array().nullable(),
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
    onUseTrinket: z.boolean()
})

export const itemToTiersetSchema = z.object({
    itemId: z.number(),
    tokenId: z.number()
})
export const itemToTiersetArraySchema = z.array(itemToTiersetSchema)

export const itemToCatalystSchema = z.object({
    itemId: z.number(),
    encounterId: z.number(),
    catalyzedItemId: z.number()
})
export const itemToCatalystArraySchema = z.array(itemToCatalystSchema)

/**
 * Rapresents a looted version of an item (so with bonus and actual ilvl)
 */
export const gearItemSchema = z.object({
    item: z.object({
        id: z.number(),
        name: z.string().optional(),
        baseItemLevel: z.number().optional(),
        slotKey: wowItemSlotKeySchema.optional()
    }),
    source: z.enum(['equipped', 'bag', 'great-vault']),
    equippedInSlot: wowItemEquippedSlotKeySchema.optional(),
    itemLevel: z.number().optional(),
    bonusString: z.preprocess((val) => {
        // Convert numbers to strings
        if (typeof val === 'number') {
            return val.toString()
        }
        return val
    }, z.string().optional()),
    enchantId: z
        .preprocess((val) => {
            // Convert numbers to strings
            if (typeof val === 'number') {
                return val.toString()
            }
            return val
        }, z.string())
        .optional(),
    gemId: z
        .preprocess((val) => {
            // Convert numbers to strings
            if (typeof val === 'number') {
                return val.toString()
            }
            return val
        }, z.string())
        .optional(),
    craftedStats: z.string().optional(),
    craftingQuality: z.string().optional()
})
