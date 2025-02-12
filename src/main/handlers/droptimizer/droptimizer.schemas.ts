import { wowItemEquippedSlotKeySchema } from '@shared/schemas/wow.schemas'
import { WowClass, WowRaidDifficulty } from '@shared/types/types'
import { z } from 'zod'
import {
    parseBagGearsFromSimc,
    parseEquippedGear,
    parseGreatVaultFromSimc
} from './droptimizer.utils'

export const droptimizerEquippedItemSchema = z.object({
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

export const raidBotSchema = z.object({
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

export const raidbotParseAndTransform = raidBotSchema.transform((data) => {
    const raidId = Number(data.sim.profilesets.results[0].name.split('/')[0])
    const dpsMean = data.sim.players[0].collected_data.dps.mean
    const upgrades = data.sim.profilesets.results.map((item) => ({
        dps: Math.round(item.mean - dpsMean),
        encounterId: Number(item.name.split('/')[1]),
        itemId: Number(item.name.split('/')[3]),
        ilvl: Number(item.name.split('/')[4]),
        slot: wowItemEquippedSlotKeySchema.parse(item.name.split('/')[6])
    }))

    return {
        simInfo: {
            date: data.timestamp,
            fightstyle: data.sim.options.fight_style,
            duration: data.sim.options.max_time,
            nTargets: data.sim.options.desired_targets,
            upgradeEquipped: data.simbot.meta.rawFormData.droptimizer.upgradeEquipped,
            raidbotInput: data.simbot.meta.rawFormData.text
                ? data.simbot.meta.rawFormData.text
                : data.simbot.input
        },
        raidInfo: {
            id: raidId,
            difficulty: data.simbot.publicTitle
                .split('•')[2]
                .replaceAll(' ', '') as WowRaidDifficulty // Difficulty is the third element
        },
        charInfo: {
            name: data.simbot.meta.rawFormData.character.name,
            // non si capisce un cazzo: a volte arriva rng: pozzo-delleternità, pozzo dell'eternità, pozzo_dell'eternità
            server: data.simbot.meta.rawFormData.character.realm
                .toLowerCase()
                .replaceAll('_', '-')
                .replaceAll(' ', '-')
                .replaceAll("'", ''),
            class: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents
                .className as WowClass,
            classId: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.classId,
            spec: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.specName,
            specId: data.simbot.meta.rawFormData.character.talentLoadouts[0].talents.specId,
            talents: data.sim.players[0].talents
        },
        weeklyChest: data.simbot.meta.rawFormData.text
            ? parseGreatVaultFromSimc(data.simbot.meta.rawFormData.text)
            : [],
        itemsInBag: data.simbot.meta.rawFormData.text
            ? parseBagGearsFromSimc(data.simbot.meta.rawFormData.text)
            : [],
        currencies: data.simbot.meta.rawFormData.character.upgradeCurrencies ?? [],
        upgrades: upgrades,
        itemsAverageItemLevel:
            data.simbot.meta.rawFormData.character.items.averageItemLevelEquipped ?? null,
        itemsAverageItemLevelEquipped:
            data.simbot.meta.rawFormData.character.items.averageItemLevelEquipped ?? null,
        itemsEquipped: parseEquippedGear(data.simbot.meta.rawFormData.droptimizer.equipped)
    }
})
