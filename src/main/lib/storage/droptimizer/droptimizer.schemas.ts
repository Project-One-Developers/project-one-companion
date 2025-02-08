import {
    droptimizerCurrenciesSchema,
    droptimizerGearItemSchema,
    droptimizerUpgradeSchema,
    droptimizerWeeklyChestSchema
} from '@shared/schemas/simulations.schemas'
import { wowClassSchema, wowRaidDiffSchema } from '@shared/schemas/wow.schemas'
import { Droptimizer } from '@shared/types/types'
import { z } from 'zod'

export const droptimizerStorageSchema = z.object({
    url: z.string().url(),
    ak: z.string(),
    dateImported: z.number(),
    simDate: z.number(),
    simFightStyle: z.string(),
    simDuration: z.number().min(1),
    simNTargets: z.number().min(1),
    simRaidbotInput: z.string(),
    simUpgradeEquipped: z.boolean(),
    raidId: z.number(),
    raidDifficulty: wowRaidDiffSchema,
    characterName: z.string(),
    characterServer: z.string(),
    characterClass: wowClassSchema,
    characterClassId: z.number(),
    characterSpec: z.string(),
    characterSpecId: z.number(),
    characterTalents: z.string(),
    upgrades: z.array(droptimizerUpgradeSchema),
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

export const droptimizerStorageToSchema = droptimizerStorageSchema.transform(
    (data): Droptimizer => {
        return {
            url: data.url,
            ak: data.ak,
            dateImported: data.dateImported,
            simInfo: {
                date: data.simDate,
                fightstyle: data.simFightStyle,
                duration: data.simDuration,
                nTargets: data.simNTargets,
                raidbotInput: data.simRaidbotInput,
                upgradeEquipped: data.simUpgradeEquipped
            },
            raidInfo: {
                id: data.raidId,
                difficulty: data.raidDifficulty
            },
            charInfo: {
                name: data.characterName,
                server: data.characterServer,
                class: data.characterClass,
                classId: data.characterClassId,
                spec: data.characterSpec,
                specId: data.characterSpecId,
                talents: data.characterTalents
            },
            upgrades: data.upgrades.map((up) => ({
                id: up.id,
                item: up.item,
                dps: up.dps,
                ilvl: up.ilvl,
                slot: up.slot,
                catalyzedItem: up.catalyzedItem,
                droptimizerId: up.droptimizerId
            })),
            weeklyChest: data.weeklyChest,
            currencies: data.currencies,
            itemsAverageItemLevel: data.itemsAverageItemLevel,
            itemsAverageItemLevelEquipped: data.itemsAverageItemLevelEquipped,
            itemsEquipped: data.itemsEquipped
        }
    }
)

export const droptimizerStorageListToSchema = z.array(droptimizerStorageToSchema)
