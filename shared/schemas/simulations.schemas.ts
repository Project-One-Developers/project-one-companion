import { z } from 'zod'
import { itemSchema, tiersetInfoSchema } from './items.schema'
import { wowClassSchema, wowItemSlotKeySchema, wowRaidDiffSchema } from './wow.schemas'

export const droptimizerUpgradeSchema = z.object({
    id: z.string(),
    dps: z.number(),
    item: itemSchema,
    ilvl: z.number(),
    slot: z.string(),
    catalyzedItem: itemSchema.nullable(),
    droptimizerId: z.string()
})

export const newDroptimizerUpgradeSchema = droptimizerUpgradeSchema
    .omit({
        id: true,
        item: true,
        catalyzedItem: true,
        droptimizerId: true
    })
    .extend({
        itemId: z.number(),
        catalyzedItemId: z.number().nullable()
    })

export const droptimizerWeeklyChestSchema = z.object({
    id: z.number(),
    bonusString: z.string(),
    itemLevel: z.number()
})

export const droptimizerCurrenciesSchema = z.object({
    id: z.number(),
    type: z.string(),
    amount: z.number()
})

export const droptimizerBagItemSchema = z.object({
    id: z.number(),
    slot: wowItemSlotKeySchema,
    bonus_id: z.preprocess((val) => {
        // Convert numbers to strings
        if (typeof val === 'number') {
            return val.toString()
        }
        return val
    }, z.string()),
    enchant_id: z
        .preprocess((val) => {
            // Convert numbers to strings
            if (typeof val === 'number') {
                return val.toString()
            }
            return val
        }, z.string())
        .nullish(),
    gem_id: z
        .preprocess((val) => {
            // Convert numbers to strings
            if (typeof val === 'number') {
                return val.toString()
            }
            return val
        }, z.string())
        .nullish(),
    craftedStats: z.string().nullish(),
    craftingQuality: z.string().nullish()
})

export const droptimizerEquippedItemSchema = z
    .object({
        itemLevel: z.number(),
        id: z.number(),
        name: z.string(),
        bonus_id: z
            .preprocess((val) => {
                // Convert numbers to strings
                if (typeof val === 'number') {
                    return val.toString()
                }
                return val
            }, z.string())
            .nullish(),
        enchant_id: z
            .preprocess((val) => {
                // Convert numbers to strings
                if (typeof val === 'number') {
                    return val.toString()
                }
                return val
            }, z.string())
            .nullish(),
        gem_id: z
            .preprocess((val) => {
                // Convert numbers to strings
                if (typeof val === 'number') {
                    return val.toString()
                }
                return val
            }, z.string())
            .nullish(),
        upgrade: z
            .object({
                level: z.number(),
                max: z.number(),
                name: z.string()
            })
            .nullish()
    })
    .nullish()

export const droptimizerEquippedItemsSchema = z.object({
    head: droptimizerEquippedItemSchema.nullish(),
    neck: droptimizerEquippedItemSchema.nullish(),
    shoulder: droptimizerEquippedItemSchema.nullish(),
    back: droptimizerEquippedItemSchema.nullish(),
    chest: droptimizerEquippedItemSchema.nullish(),
    wrist: droptimizerEquippedItemSchema.nullish(),
    hands: droptimizerEquippedItemSchema.nullish(),
    waist: droptimizerEquippedItemSchema.nullish(),
    legs: droptimizerEquippedItemSchema.nullish(),
    feet: droptimizerEquippedItemSchema.nullish(),
    finger1: droptimizerEquippedItemSchema.nullish(),
    finger2: droptimizerEquippedItemSchema.nullish(),
    trinket1: droptimizerEquippedItemSchema.nullish(),
    trinket2: droptimizerEquippedItemSchema.nullish(),
    main_hand: droptimizerEquippedItemSchema.nullish(),
    off_hand: droptimizerEquippedItemSchema.nullish()
})

export const droptimizerSchema = z.object({
    url: z.string().url(),
    ak: z.string(),
    dateImported: z.number(),
    simInfo: z.object({
        date: z.number(),
        fightstyle: z.string(),
        duration: z.number().min(1),
        nTargets: z.number().min(1),
        raidbotInput: z.string(),
        upgradeEquipped: z.boolean()
    }),
    raidInfo: z.object({
        id: z.number(),
        difficulty: wowRaidDiffSchema
    }),
    charInfo: z.object({
        name: z.string(),
        server: z.string(),
        class: wowClassSchema,
        classId: z.number().min(1).max(13), // https://wowpedia.fandom.com/wiki/ClassId
        spec: z.string(),
        specId: z.number(), // https://wowpedia.fandom.com/wiki/SpecializationID
        talents: z.string()
    }),
    upgrades: z.array(droptimizerUpgradeSchema).nullable(),
    weeklyChest: z.array(droptimizerWeeklyChestSchema).nullable(),
    currencies: z.array(droptimizerCurrenciesSchema).nullable(),
    itemsAverageItemLevel: z.number().nullable(),
    itemsAverageItemLevelEquipped: z.number().nullable(),
    itemsInBag: z.array(droptimizerBagItemSchema).nullable(),
    itemsEquipped: droptimizerEquippedItemsSchema,
    tiersetInfo: z.array(tiersetInfoSchema)
})

export const newDroptimizerSchema = droptimizerSchema.omit({ upgrades: true }).extend({
    upgrades: z.array(newDroptimizerUpgradeSchema)
})

export const raidbotsURLSchema = z
    .string()
    .url()
    .refine((url) => url.includes('raidbots.com/simbot/report'), {
        message: 'URL must be a raidbots.com report URL'
    })
    .brand('RaidbotsURL')
