import { z } from 'zod'

export const droptimizerEquippedItemSchema = z.object({
    itemLevel: z.number(),
    id: z.number(),
    name: z.string(),
    bonus_id: z
        .preprocess(val => {
            // Convert numbers to strings
            if (typeof val === 'number') {
                return val.toString()
            }
            return val
        }, z.string())
        .nullish(),
    enchant_id: z
        .preprocess(val => {
            // Convert numbers to strings
            if (typeof val === 'number') {
                return val.toString()
            }
            return val
        }, z.string())
        .nullish(),
    gem_id: z
        .preprocess(val => {
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

export const droptimizerEquippedItemsSchema = z.object({
    head: droptimizerEquippedItemSchema.optional(),
    neck: droptimizerEquippedItemSchema.optional(),
    shoulder: droptimizerEquippedItemSchema.optional(),
    back: droptimizerEquippedItemSchema.optional(),
    chest: droptimizerEquippedItemSchema.optional(),
    wrist: droptimizerEquippedItemSchema.optional(),
    hands: droptimizerEquippedItemSchema.optional(),
    waist: droptimizerEquippedItemSchema.optional(),
    legs: droptimizerEquippedItemSchema.optional(),
    feet: droptimizerEquippedItemSchema.optional(),
    finger1: droptimizerEquippedItemSchema.optional(),
    finger2: droptimizerEquippedItemSchema.optional(),
    trinket1: droptimizerEquippedItemSchema.optional(),
    trinket2: droptimizerEquippedItemSchema.optional(),
    mainHand: droptimizerEquippedItemSchema.optional(),
    offHand: droptimizerEquippedItemSchema.optional()
})

export type RaidbotJson = z.infer<typeof raidbotJsonSchema>

export const raidbotJsonSchema = z.object({
    sim: z.object({
        options: z.object({
            fight_style: z.string(),
            desired_targets: z.number(),
            max_time: z.number()
        }),
        players: z.array(
            z.object({
                name: z.string(),
                talents: z.string(),
                specialization: z.string(), //eg: 'Augmentation Evoker'
                collected_data: z.object({
                    dps: z.object({
                        mean: z.number()
                    })
                })
            })
        ),
        profilesets: z.object({
            metric: z.string(),
            // upgrades
            results: z.array(
                z.object({
                    name: z.string(),
                    mean: z.number()
                })
            )
        }),
        statistics: z.object({
            raid_dps: z.object({
                mean: z.number() // for evokers, this is the dps of the whole raid
            })
        })
    }),
    simbot: z.object({
        title: z.string(),
        publicTitle: z.string(),
        simType: z.literal('droptimizer'), // At the moment, we only support droptimizer sims
        input: z.string(), // original raidbot input
        meta: z.object({
            rawFormData: z.object({
                text: z.string(),
                character: z.object({
                    name: z.string(),
                    realm: z.string(),
                    items: z.object({
                        averageItemLevel: z.number().nullish(),
                        averageItemLevelEquipped: z.number().nullish()
                    }),
                    upgradeCurrencies: z
                        .array(
                            z.object({
                                type: z.string(),
                                id: z.number(),
                                amount: z.number()
                            })
                        )
                        .nullish(),
                    talentLoadouts: z.array(
                        z.object({
                            talents: z.object({
                                className: z.string(),
                                classId: z.number(),
                                specName: z.string(),
                                specId: z.number()
                            })
                        })
                    )
                }),
                droptimizer: z.object({
                    upgradeEquipped: z.boolean(),
                    equipped: droptimizerEquippedItemsSchema
                })
            })
        })
    }),
    timestamp: z.number()
})
