import { z } from 'zod'
import { itemSchema } from './items.schema'
import { wowClassSchema, wowRaidDiffSchema } from './wow.schemas'

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

export const droptimizerGearItemSchema = z
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
    itemsEquipped: z.object({
        head: droptimizerGearItemSchema.nullish(),
        neck: droptimizerGearItemSchema.nullish(),
        shoulder: droptimizerGearItemSchema.nullish(),
        back: droptimizerGearItemSchema.nullish(),
        chest: droptimizerGearItemSchema.nullish(),
        wrist: droptimizerGearItemSchema.nullish(),
        hands: droptimizerGearItemSchema.nullish(),
        waist: droptimizerGearItemSchema.nullish(),
        legs: droptimizerGearItemSchema.nullish(),
        feet: droptimizerGearItemSchema.nullish(),
        finger1: droptimizerGearItemSchema.nullish(),
        finger2: droptimizerGearItemSchema.nullish(),
        trinket1: droptimizerGearItemSchema.nullish(),
        trinket2: droptimizerGearItemSchema.nullish(),
        main_hand: droptimizerGearItemSchema.nullish(),
        off_hand: droptimizerGearItemSchema.nullish()
    })
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
