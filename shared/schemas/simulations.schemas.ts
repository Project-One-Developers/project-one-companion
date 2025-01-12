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

export const droptimizerSchema = z.object({
    url: z.string().url(),
    ak: z.string(),
    dateImported: z.number(),
    simInfo: z.object({
        date: z.number(),
        fightstyle: z.string(),
        duration: z.number().min(1),
        nTargets: z.number().min(1),
        raidbotInput: z.string()
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
    upgrades: z.array(droptimizerUpgradeSchema).nullable()
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
