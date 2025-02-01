import { z } from 'zod'
import { wowArmorTypeSchema, wowItemSlotSchema } from './wow.schemas'

export const itemSchema = z.object({
    id: z.number(),
    name: z.string(),
    ilvlMythic: z.number(),
    ilvlHeroic: z.number(),
    ilvlNormal: z.number(),
    bonusID: z.string().nullish(),
    itemClass: z.string(),
    slot: wowItemSlotSchema.nullish(),
    itemSubclass: z.string().nullish(),
    armorType: wowArmorTypeSchema.nullish(),
    tokenPrefix: z.string().nullish(),
    tier: z.boolean().default(false),
    veryRare: z.boolean().default(false),
    catalyzed: z.boolean().default(false),
    boe: z.boolean().default(false),
    specs: z.string().array().nullish(),
    specIds: z.string().array().nullish(),
    classes: z.string().array().nullish(),
    classesId: z.string().array().nullish(),
    stats: z.string().nullish(),
    mainStats: z.string().nullish(),
    secondaryStats: z.string().nullish(),
    wowheadUrl: z.string().url(),
    iconName: z.string(),
    iconUrl: z.string().url(),
    bossName: z.string(),
    bossId: z.number(),
    sourceId: z.number(), // instance id (eg: raid id, profession id, mplus name)
    sourceName: z.string(),
    sourceType: z.string(),
    onUseTrinket: z.boolean().nullish()
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
