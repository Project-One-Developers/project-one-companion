import { z } from 'zod'
import { gearItemSchema, itemSchema } from './items.schema'
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

export const droptimizerCurrenciesSchema = z.object({
    id: z.number(),
    type: z.string(),
    amount: z.number()
})

export const droptimizerEquippedItemsSchema = z.object({
    head: gearItemSchema.optional(),
    neck: gearItemSchema.optional(),
    shoulder: gearItemSchema.optional(),
    back: gearItemSchema.optional(),
    chest: gearItemSchema.optional(),
    wrist: gearItemSchema.optional(),
    hands: gearItemSchema.optional(),
    waist: gearItemSchema.optional(),
    legs: gearItemSchema.optional(),
    feet: gearItemSchema.optional(),
    finger1: gearItemSchema.optional(),
    finger2: gearItemSchema.optional(),
    trinket1: gearItemSchema.optional(),
    trinket2: gearItemSchema.optional(),
    main_hand: gearItemSchema.optional(),
    off_hand: gearItemSchema.optional()
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
    weeklyChest: z.array(gearItemSchema).nullable(),
    currencies: z.array(droptimizerCurrenciesSchema).nullable(),
    itemsAverageItemLevel: z.number().nullable(),
    itemsAverageItemLevelEquipped: z.number().nullable(),
    itemsInBag: z.array(gearItemSchema).nullable(),
    itemsEquipped: droptimizerEquippedItemsSchema,
    tiersetInfo: z.array(gearItemSchema)
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
