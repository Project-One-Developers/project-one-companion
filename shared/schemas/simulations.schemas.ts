import { z } from 'zod'
import { gearItemSchema, itemSchema } from './items.schema'
import { wowClassNameSchema, wowItemEquippedSlotKeySchema, wowRaidDiffSchema } from './wow.schemas'

export const droptimizerUpgradeSchema = z.object({
    id: z.string(),
    dps: z.number(),
    item: itemSchema,
    ilvl: z.number(),
    slot: wowItemEquippedSlotKeySchema,
    catalyzedItemId: itemSchema.shape.id.nullable(),
    tiersetItemId: itemSchema.shape.id.nullable(),
    droptimizerId: z.string()
})

export const newDroptimizerUpgradeSchema = droptimizerUpgradeSchema
    .omit({
        id: true,
        item: true,
        droptimizerId: true
    })
    .extend({
        itemId: z.number()
    })

export const droptimizerCurrenciesSchema = z.object({
    id: z.number(),
    type: z.string(),
    amount: z.number()
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
        upgradeEquipped: z.boolean()
    }),
    raidInfo: z.object({
        id: z.number(),
        difficulty: wowRaidDiffSchema
    }),
    charInfo: z.object({
        name: z.string(),
        server: z.string(),
        class: wowClassNameSchema,
        classId: z.number().min(1).max(13), // https://wowpedia.fandom.com/wiki/ClassId
        spec: z.string(),
        specId: z.number(), // https://wowpedia.fandom.com/wiki/SpecializationID
        talents: z.string()
    }),
    upgrades: z.array(droptimizerUpgradeSchema),
    weeklyChest: z.array(gearItemSchema),
    currencies: z.array(droptimizerCurrenciesSchema),
    itemsAverageItemLevel: z.number().nullable(),
    itemsAverageItemLevelEquipped: z.number().nullable(),
    itemsInBag: z.array(gearItemSchema),
    itemsEquipped: z.array(gearItemSchema),
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
