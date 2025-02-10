import {
    droptimizerBagItemSchema,
    droptimizerCurrenciesSchema,
    droptimizerEquippedItemSchema,
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
    itemsInBag: z.array(droptimizerBagItemSchema).nullable(),
    itemsEquipped: z.object({
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
            itemsEquipped: data.itemsEquipped,
            itemsInBag: data.itemsInBag
        }
    }
)

export const droptimizerStorageListToSchema = z.array(droptimizerStorageToSchema)
